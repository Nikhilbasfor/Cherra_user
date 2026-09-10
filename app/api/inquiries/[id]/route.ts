import { NextResponse } from "next/server";
import { dbGetInquiries, dbSaveInquiry } from "@/lib/db";
import { InquiryLead } from "@/lib/types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface Params {
  params: Promise<{ id: string }>;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const inquiries = await dbGetInquiries();
    const existing = inquiries.find((i) => i.id === id);
    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404, headers: corsHeaders });
    }

    const updated: InquiryLead = {
      ...existing,
      ...body,
      id,
    };

    const saved = await dbSaveInquiry(updated);
    return NextResponse.json(saved, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
