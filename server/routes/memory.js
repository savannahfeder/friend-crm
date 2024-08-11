const express = require("express");
const router = express.Router();
const anthropic = require("@anthropic-ai/sdk");
const { admin, db } = require("../firebaseAdmin.js");

const client = new anthropic.Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function extractFieldsWithClaude(memoryData) {
  try {
    const message = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0,
      system:
        "You are an AI assistant designed to extract specific information from memory data. Always return your response as a valid JSON object.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract the following fields from this memory data:
                1. Name: The name of the person discussed in the memory.
                2. Key Facts: A summary of important facts and topics discussed.
                3. Category: The category of the conversation or interaction.
                Return the result as a JSON object.
                Here's the memory data: ${JSON.stringify(memoryData)}`,
            },
          ],
        },
      ],
    });
    console.log("Claude API Response (Field Extraction):", message.content);
    return JSON.parse(message.content[0].text);
  } catch (error) {
    console.error(
      "Error interacting with Claude API (Field Extraction):",
      error.message
    );
    throw error;
  }
}

async function generateOutreachEmailWithClaude(extractedFields) {
  try {
    const message = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.7,
      system:
        "Your task is to write a short, casual outreach email given information about a recent meeting with the recipient, their projects, and your product. The email should be friendly and conversational, using brief paragraphs and clear, straightforward sentences. Include specific details from your interaction, describe your product concisely with its key benefit, and add a low-pressure call-to-action. Use ampersands where appropriate and sign off with just your first name. Aim for a natural, personal tone with minimal punctuation and occasional sentence fragments. IMPORTANT: Provide only the email text in your response. Absolutely no other scaffolding or text.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate an outreach email based on this information:
                Name: ${extractedFields.Name}
                Key Facts: ${extractedFields["Key Facts"]}
                Category: ${extractedFields.Category}
                Product: Probe (A tool that helps validate ideas by talking to real people in your target market)`,
            },
          ],
        },
      ],
    });
    console.log("Claude API Response (Email Generation):", message.content);
    return message.content[0].text;
  } catch (error) {
    console.error(
      "Error interacting with Claude API (Email Generation):",
      error.message
    );
    throw error;
  }
}

router.post("/memory-creation", async (req, res) => {
  try {
    const { userId, crmId } = req.query;
    if (!userId || !crmId) {
      return res
        .status(400)
        .json({ error: "Missing userId or crmId in query parameters" });
    }
    console.log("\n=== Memory Creation ===");
    console.log("Memory Data:", JSON.stringify(req.body, null, 2));

    const extractedFields = await extractFieldsWithClaude(req.body);
    console.log("Extracted Fields:", extractedFields);

    const outreachEmail = await generateOutreachEmailWithClaude(
      extractedFields
    );
    console.log("Generated Outreach Email:", outreachEmail);

    if (!db) {
      throw new Error("Firestore database is not initialized");
    }

    const userRef = db.collection("users").doc(userId);
    const crmRef = userRef.collection("crms").doc(crmId);
    const friendsCollectionRef = crmRef.collection("friends");

    const friendRef = await friendsCollectionRef.add({
      name: extractedFields.Name,
      keyFacts: extractedFields["Key Facts"],
      category: extractedFields.Category,
      outreachEmail: outreachEmail,
      dateAdded: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Created Firestore record:", friendRef.id);

    res.json({
      message: "Memory received, processed, and stored in Firestore",
      userId: userId,
      crmId: crmId,
      friendId: friendRef.id,
    });
  } catch (error) {
    console.error("Error processing memory:", error);
    res
      .status(500)
      .json({ error: "Error processing memory", details: error.message });
  }
});

// GET route for testing
router.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});

module.exports = router;
