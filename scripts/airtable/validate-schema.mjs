import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specPath = path.join(__dirname, "schema-spec.json");
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));

const token = process.env.AIRTABLE_PAT_TOKEN;
if (!token) {
  console.error("AIRTABLE_PAT_TOKEN is missing in environment.");
  process.exit(1);
}

const baseId = spec.baseId;
const res = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
  headers: { Authorization: `Bearer ${token}` },
});

if (!res.ok) {
  const body = await res.text();
  console.error("Failed to fetch Airtable schema:", res.status, body);
  process.exit(1);
}

const data = await res.json();
const tables = new Map(data.tables.map((t) => [t.name, t]));

let hasIssues = false;

for (const [tableName, fields] of Object.entries(spec.tables)) {
  const table = tables.get(tableName);
  if (!table) {
    console.error(`Missing table: ${tableName}`);
    hasIssues = true;
    continue;
  }

  const actualFields = new Set(table.fields.map((f) => f.name));
  const missingFields = fields.filter((f) => !actualFields.has(f));
  if (missingFields.length) {
    console.error(`Missing fields in ${tableName}: ${missingFields.join(", ")}`);
    hasIssues = true;
  }
}

if (hasIssues) {
  process.exit(1);
}

console.log("Airtable schema validation PASSED.");
