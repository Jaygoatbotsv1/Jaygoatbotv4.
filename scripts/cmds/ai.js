const axios = require('axios');

const Prefixes = [
  'ai',
  'ask',
  'gpt',
  'openai',
  '@ai',
];

module.exports = {
  config: {
    name: 'ai',
    version: '1.0.5',
    author: 'ArYAN',
    role: 0,
    category: 'ai',
    longDescription: {
      en: 'AI is designed to answer user queries and engage in conversations based on user input. It provides responses and insights on a wide range of topics.'
    },
    guide: {
      en: `
      Command: ai [question]
      - Use this command to ask a question to the AI chatbot.
      - Example: ai What is the weather like today?

      Reply with "reset" to clear the conversation history.
      `
    }
  },
  onStart: async () => {},
  onChat: async ({ api, event, args, message, usersData }) => {
    const prefix = Prefixes.find(p => event.body.toLowerCase().startsWith(p));
    if (!prefix) return;

    const question = event.body.slice(prefix.length).trim();
    if (!question) {
      return message.reply("❗ It looks like you didn't provide a question. Please include a question after the command so I can assist you.");
    }

    const uid = event.senderID;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const startTime = Date.now();

    try {
      const response = await axios.get('https://king-aryanapis.onrender.com/gts/smile', {
        params: { uid, question }
      });

      if (response.status !== 200 || !response.data) {
        throw new Error('Invalid or missing response from API');
      }

      const answer = response.data.response;
      const endTime = Date.now();
      const processTimeSec = ((endTime - startTime) / 1000).toFixed(2);

      const user = await usersData.get(event.senderID);
      const name = user ? user.name : "a user";
      const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila", hour12: true });

      const replyMessage = await message.reply(`📝 **Question**: ${question}\n━━━━━━━━━━━━━━━━\n\n✅ **Answer**: ${answer}\n\n━━━━━━━━━━━━━━━━\n🗣 **Asked by**: ${name}\n⏰ **Response Time**: ${currentDateTime}\n⏲ **Processing Time**: ${processTimeSec} seconds`);

      global.GoatBot.onReply.set(replyMessage.messageID, {
        commandName: module.exports.config.name,
        messageID: replyMessage.messageID,
        author: event.senderID
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (error) {
      console.error(`Error fetching response: ${error.message}, Status Code: ${error.response ? error.response.status : 'N/A'}`);
      message.reply(`⚠️ An error occurred while processing your request. Error: ${error.message}${error.response ? `, Status Code: ${error.response.status}` : ''}. Please try again later.`);

      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  },

  onReply: async ({ api, event, Reply, message, usersData }) => {
    const { author } = Reply;
    const userReply = event.body.trim();
    const uid = event.senderID;

    if (author !== uid) {
      return message.reply("⚠️ You are not authorized to reply to this message.");
    }

    if (global.GoatBot.onReply.has(event.messageID)) {
      return;
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    if (userReply.toLowerCase() === 'reset') {
      try {
        const response = await axios.get('https://king-aryanapis.onrender.com/gts/reset', {
          params: { uid }
        });

        if (response.status !== 200 || !response.data.status) {
          throw new Error('Invalid or missing response from API');
        }

        message.reply("✅ The conversation history has been successfully cleared.");

        api.setMessageReaction("✅", event.messageID, () => {}, true);

      } catch (error) {
        console.error(`Error resetting conversation: ${error.message}, Status Code: ${error.response ? error.response.status : 'N/A'}`);
        message.reply(`⚠️ An error occurred while clearing the conversation history. Error: ${error.message}${error.response ? `, Status Code: ${error.response.status}` : ''}. Please try again later.`);

        api.setMessageReaction("❌", event.messageID, () => {}, true);
      }
      return;
    }

    const startTime = Date.now();

    try {
      const response = await axios.get('https://king-aryanapis.onrender.com/gts/smile', {
        params: { uid, question: userReply }
      });

      if (response.status !== 200 || !response.data) {
        throw new Error('Invalid or missing response from API');
      }

      const followUpResponse = response.data.response;
      const endTime = Date.now();
      const processTimeSec = ((endTime - startTime) / 1000).toFixed(2);

      const user = await usersData.get(event.senderID);
      const name = user ? user.name : "a user";
      const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila", hour12: true });

      const followUpMessage = await message.reply(`📝 **Question**: ${userReply}\n━━━━━━━━━━━━━━━━\n\n✅ **Answer**: ${followUpResponse}\n\n━━━━━━━━━━━━━━━━\n🗣 **Asked by**: ${name}\n⏰ **Response Time**: ${currentDateTime}\n⏲ **Processing Time**: ${processTimeSec} seconds`);

      global.GoatBot.onReply.set(followUpMessage.messageID, {
        commandName: module.exports.config.name,
        messageID: followUpMessage.messageID,
        author: event.senderID
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (error) {
      console.error(`Error fetching follow-up response: ${error.message}, Status Code: ${error.response ? error.response.status : 'N/A'}`);
      message.reply(`⚠️ An error occurred while processing your reply. Error: ${error.message}${error.response ? `, Status Code: ${error.response.status}` : ''}. Please try again later.`);

      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
