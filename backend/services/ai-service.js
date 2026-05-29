const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/user-model");
const AppError = require("../utils/appError");

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generateIcebreakers(senderId, receiverId) {
    const sender = await User.findById(senderId).select(
      "name age bio interests",
    );
    const receiver = await User.findById(receiverId).select(
      "name age bio interests",
    );

    if (!sender || !receiver) {
      throw new AppError("Users not found for generating icebreakers", 404);
    }

    const sharedInterests = sender.interests.filter((interest) =>
      receiver.interests?.includes(interest),
    );

    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" },
        });

        const prompt = `You are an expert, highly charming dating assistant. Write exactly 3 highly engaging, creative, friendly, and personalized conversation starters (icebreakers) that User A can send to User B.
User A details:
- Name: ${sender.name}
- Age: ${sender.age}
- Bio: ${sender.bio || "None"}
- Interests: ${sender.interests.join(", ") || "None"}

User B details:
- Name: ${receiver.name}
- Age: ${receiver.age}
- Bio: ${receiver.bio || "None"}
- Interests: ${receiver.interests.join(", ") || "None"}

Shared interests: ${sharedInterests.join(", ") || "None"}

Requirements:
- Make them natural, witty, and referencing User B's interests or bio.
- Do not make them overly cheesy or generic.
- Keep each line short (1-2 sentences).
- Output must be a valid JSON array of exactly 3 strings. Example: ["icebreaker 1", "icebreaker 2", "icebreaker 3"].
- Return ONLY the raw JSON array. No markdown blocks, no formatting.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed.slice(0, 3);
        }
      } catch (error) {
        console.error("Gemini API error, using smart fallback:", error.message);
      }
    }

    return this._getFallbackIcebreakers(sender, receiver, sharedInterests);
  }

  _getFallbackIcebreakers(sender, receiver, sharedInterests) {
    const list = [];

    if (sharedInterests.length > 0) {
      list.push(
        `Hey ${receiver.name}! I noticed we both love ${sharedInterests[0]}. What got you into that?`,
        `Hi ${receiver.name}! Always exciting to meet a fellow ${sharedInterests[0]} fan. What's your favorite thing about it?`,
      );
    } else if (receiver.interests && receiver.interests.length > 0) {
      list.push(
        `Hey ${receiver.name}! I see you're interested in ${receiver.interests[0]}. I'd love to hear more about that!`,
        `Hi ${receiver.name}! Your interest in ${receiver.interests[0]} caught my eye. What's a must-try experience in that?`,
      );
    } else {
      list.push(
        `Hey ${receiver.name}! I really liked your profile. How is your week going?`,
        `Hi ${receiver.name}! If you could travel anywhere tomorrow, where would you go?`,
      );
    }

    if (receiver.bio) {
      list.push(
        `Hey ${receiver.name}! Your bio stood out to me. Let's trade some fun stories!`,
      );
    } else {
      list.push(
        `Hey ${receiver.name}! Let's skip the small talk: what's your ultimate comfort food?`,
      );
    }

    return list.slice(0, 3);
  }
}

module.exports = new AIService();
