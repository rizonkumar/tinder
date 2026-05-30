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

  async generateSmartReplies(senderId, receiverId) {
    const sender = await User.findById(senderId).select(
      "name age bio interests",
    );
    const receiver = await User.findById(receiverId).select(
      "name age bio interests",
    );

    if (!sender || !receiver) {
      throw new AppError("Users not found for generating smart replies", 404);
    }

    // Retrieve recent conversation history
    const Message = require("../models/message-model");
    const recentMessages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Reverse to get chronological order
    recentMessages.reverse();

    const formattedHistory = recentMessages
      .map(
        (m) =>
          `${m.sender.toString() === senderId.toString() ? sender.name : receiver.name}: ${m.content}`
      )
      .join("\n");

    if (this.genAI && recentMessages.length > 0) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" },
        });

        const prompt = `You are an expert, highly charming AI Wingman dating assistant. Generate exactly 3 highly personalized, context-aware, engaging, and charming reply suggestions that ${sender.name} (User A) can send as a response to ${receiver.name} (User B) based on their recent conversation history and profile details.

Recent Conversation History (chronological):
${formattedHistory || "No messages exchanged yet."}

User A (Sender) details:
- Name: ${sender.name}
- Age: ${sender.age}
- Bio: ${sender.bio || "None"}
- Interests: ${sender.interests.join(", ") || "None"}

User B (Recipient) details:
- Name: ${receiver.name}
- Age: ${receiver.age}
- Bio: ${receiver.bio || "None"}
- Interests: ${receiver.interests.join(", ") || "None"}

Requirements:
- The replies must directly continue the conversation thread naturally.
- Provide distinct styles: One charming/romantic/friendly, one humorous/witty, and one open-ended/engaging question.
- Keep each reply concise (1 short sentence, maximum 15 words) so it fits in a chat bubble easily.
- Output must be a valid JSON array of exactly 3 strings. Example: ["reply 1", "reply 2", "reply 3"].
- Return ONLY the raw JSON array. No markdown blocks, no formatting.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed.slice(0, 3);
        }
      } catch (error) {
        console.error("Gemini API smart replies error, using fallback:", error.message);
      }
    }

    return this._getFallbackReplies(sender, receiver, recentMessages);
  }

  _getFallbackReplies(sender, receiver, recentMessages) {
    const lastMsg = recentMessages[recentMessages.length - 1];
    if (lastMsg && lastMsg.sender.toString() === sender._id.toString()) {
      return [
        `What's your favorite way to spend a weekend, ${receiver.name}?`,
        `By the way, I loved your bio! What inspired you to write that?`,
        `Tell me one secret interest of yours that isn't on your profile!`,
      ];
    }

    return [
      `That sounds so interesting, ${receiver.name}! Tell me more.`,
      `Haha, love that! You've got great energy.`,
      `Oh wow! What's the story behind that?`,
    ];
  }
}

module.exports = new AIService();
