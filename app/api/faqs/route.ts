import { NextResponse } from "next/server";
import { dbGetFAQs, dbSaveFAQ } from "@/lib/db";
import { FAQItem } from "@/lib/types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const faqs = await dbGetFAQs();
    return NextResponse.json(faqs, { headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const body: FAQItem = await req.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400, headers: corsHeaders });
    }
    const id = body.id || ("faq-" + Date.now());
    const saved = await dbSaveFAQ({ ...body, id });
    return NextResponse.json(saved, { status: 201, headers: corsHeaders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
