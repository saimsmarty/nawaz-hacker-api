const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("🍼 Baby AI is running — Powered by Gemini Pro | Made by Nawaz Boss");
});

app.get("/ask", async (req, res) => {
  const userInput = req.query.message;

  if (!userInput) {
    return res.status(400).json({ error: "Message is required!" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(userInput);
    const response = await result.response;
    const text = response.text();

    // 🔹 Special creator response
    if (/किसने बनाया|developer|who made you|who created|creator|owner/i.test(userInput)) {
      return res.json({
        reply: "💡 मुझे Nawaz Boss ने बनाया और डेवेलप किया है! 🔥"
      });
    }

    // 🔹 Trigger: Baby
    if (/^baby[, ]*/i.test(userInput)) {
      return res.json({
        reply: "हाँ बोलो, मैं Baby AI हूँ 😊"
      });
    }

    res.json({ reply: text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🍼 Baby AI Server started at http://localhost:${PORT}`);
});
