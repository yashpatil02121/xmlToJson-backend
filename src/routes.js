import { Router } from "express";
import fs from "fs";
import path from "path";
import { parseXML } from "./parser.js";

const router = Router();

// POST :: /api/xmlToJson
router.post("/xmlToJson", (req, res) => {
  try {
    const xmlFilePath = path.join(process.cwd(), "./public/test.xml");
    const xmlContent = fs.readFileSync(xmlFilePath, "utf-8");
    // Call your custom parser (no XML lib allowed)
    const jsonOutput = parseXML(xmlContent);



    // Save to output.json
    const outputPath = path.join(process.cwd(), "output.json");
    fs.writeFileSync(outputPath, JSON.stringify(jsonOutput, null, 2));

    res.json({ message: "Conversion successful", output: jsonOutput });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to convert XML to JSON" });
  }
});

export { router };
