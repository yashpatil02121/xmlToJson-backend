import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { parseXML } from "./parser.js";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'text/xml' ||
      file.mimetype === 'application/xml' ||
      file.originalname.endsWith('.xml')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only XML files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST :: /api/xmlToJson
router.post("/xmlToJson", upload.any(), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No XML file uploaded" });
    }

    // Get the first uploaded file (assuming only one file is expected)
    const uploadedFile = req.files[0];

    // Validate file type
    if (!uploadedFile.originalname.endsWith('.xml') &&
        uploadedFile.mimetype !== 'text/xml' &&
        uploadedFile.mimetype !== 'application/xml') {
      return res.status(400).json({ error: "Only XML files are allowed" });
    }

    const xmlContent = uploadedFile.buffer.toString('utf-8');
    // Call your custom parser (no XML lib allowed)
    const jsonOutput = parseXML(xmlContent);



    // Save to output.json
    const outputPath = path.join(process.cwd(), "output.json");
    fs.writeFileSync(outputPath, JSON.stringify(jsonOutput, null, 2));

    res.json({ message: "Conversion successful", output: jsonOutput });
  } catch (err) {
    console.error(err);
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
      }
    }
    res.status(500).json({ error: "Failed to convert XML to JSON" });
  }
});

export { router };
