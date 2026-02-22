
import fs from "fs/promises";
import path from "path";

const apiKey = "AIzaSyAUrxlcCO__O1Dp3hsCX-znICIFt2AyB-4";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

const dir = "C:/Users/ninef/SanLuis Solutions projects/sjr-new-website-aiproject/public/images/services";

async function generateAlts() {
  const files = (await fs.readdir(dir)).filter(f => f.endsWith(".jpg"));
  const alts = {};
  
  for (const file of files) {
    const p = path.join(dir, file);
    const m = await fs.readFile(p);
    const base64Image = m.toString("base64");
    
    // Create a descriptive prompt for SEO/GEO/AEO
    const prompt = `Write a highly descriptive, SEO-optimized alt text (max 15 words) for this jewelry repair/sales image. Be factual, use relevant keywords (e.g., gold watch, diamond ring setting, pearl necklace, jewelry repair). Return ONLY the alt text string with no quotes.`;

    const d = {
      contents: [{
        parts: [
          {text: prompt},
          {inlineData: {mimeType: "image/jpeg", data: base64Image}}
        ]
      }]
    };
    
    try {
        let retries = 3;
        while(retries > 0) {
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(d)
            });
            const json = await res.json();
            if (json.error) {
                console.log("Error", file, json.error.message);
                if(json.error.code === 429) {
                    console.log("Rate limit, waiting 30s");
                    await new Promise(r => setTimeout(r, 30000));
                    continue;
                }
                retries--;
                continue;
            }
            let alt = json.candidates[0].content.parts[0].text.trim().replace(/^"|"$/g, "");
            alts[file.replace(".jpg", "")] = alt;
            console.log(`Generated alt for ${file}: ${alt}`);
            break;
        }
    } catch(e) {
        console.error(`Failed ${file}`, e.message);
    }
    await new Promise(r => setTimeout(r, 4500));
  }
  
  await fs.writeFile("C:/Users/ninef/SanLuis Solutions projects/sjr-new-website-aiproject/src/lib/image-alts.json", JSON.stringify(alts, null, 2));
  console.log("Done generating alt tags!");
}
generateAlts();

