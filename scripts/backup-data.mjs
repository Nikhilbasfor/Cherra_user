import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "data");
const BACKUPS_DIR = path.join(__dirname, "..", "backups");

if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn(`Warning reading ${filePath}:`, err.message);
  }
  return null;
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFileName = `backup-${timestamp}.json`;
const backupFilePath = path.join(BACKUPS_DIR, backupFileName);

console.log("📦 Starting Cherrapunji Hotels database snapshot...");

const filesToBackup = [
  "hotels.json",
  "inquiries.json",
  "attractions.json",
  "faqs.json",
  "reviews.json",
  "stats.json",
];

const snapshot = {
  version: "1.0",
  createdAt: new Date().toISOString(),
  environment: process.env.NODE_ENV || "production",
  collections: {},
  summary: {},
};

for (const fileName of filesToBackup) {
  const filePath = path.join(DATA_DIR, fileName);
  const data = readJsonSafe(filePath);
  const key = fileName.replace(".json", "");
  snapshot.collections[key] = data;
  snapshot.summary[key] = Array.isArray(data) ? data.length : data ? 1 : 0;
}

fs.writeFileSync(backupFilePath, JSON.stringify(snapshot, null, 2), "utf-8");

console.log(`✅ Backup successfully saved to: backups/${backupFileName}`);
console.log("📊 Summary of backed up collections:");
console.table(snapshot.summary);
