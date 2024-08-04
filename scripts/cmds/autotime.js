const moment = require('moment-timezone');

module.exports.config = {
  name: "autotime",
  version: "2.0.0",
  role: 0,
  author: "kylepogi", // ninakaw ni jay heheheh laplapin kita!! 
  description: "Automatically sends messages based on set times.",
  category: "AutoTime",
  countDown: 3
};

module.exports.onLoad = async ({ api }) => {
  const arrayData = {
    "12:00:00 PM": {
      message: " good afternoon everyone don't forget to eat y'all lunch break🍛"
    },
    "01:00:00 AM": {
      message: " good morning everyone!!, have a nice morning🍞☕🌅"
    },
    "02:00:00 AM": {
      message: " don't forget to add/follow my owner☺.\n\n📩: https://www.facebook.com/jayboy.pillonar?mibextid=ZbWKwL"
    },
    "03:00:00 AM": {
      message: " aga nyo nagising ahh"
    },
    "04:00:00 AM": {
      message: " eyyy🤙,gising naba mga may pasok dyan?"
    },
    "05:00:00 AM": {
      message: " kain na kaagad guys para maka punta na tayo sa school🏫"
    },
    "06:00:00 AM": {
      message: " tara punta na tayo sa school🏫"
    },
    "07:00:00 AM": {
      message: " start kaagad nang first period🥹"
    },
    "08:00:00 AM": {
      message: " 1hour and 15,papo recess na🤩🤩"
    },
    "09:00:00 AM": {
      message: " baka hinde pa kayo kumain kain na kayo💀🙏"
    },
    "10:00:00 AM": {
      message: " wag mo kalimutan e chat owner ko💀🙏"
    },
    "11:00:00 AM": {
      message: " 30 mins left lunch break napo tayo😊"
    },
    "12:00:00 PM": {
      message: " add nyona owner ko,baka malay mo andun lang pala truelove mo,huyy😆🥰"
    },
    "01:00:00 PM": {
      message: " don't forget to eat y'all lunch break😸"
    },
    "02:00:00 PM": {
      message: " good afternoon!!, my owner is so handsome asf😎"
    },
    "03:00:00 PM": {
      message: "┃ pogi ng owner ko na si Jay 😎"
    },
    "04:00:00 PM": {
      message: " magandang hapon mga lods😸"
    },
    "05:00:00 PM": {
      message: " check po muna baka may assignment"
    },
    "06:00:00 PM": {
      message: " don't forget to eat y'all dinner💀🙏"
    },
    "07:00:00 PM": {
      message: " ano silbe ng pag online mo kung hinde mo din naman e chachat owner ko😎"
    },
    "08:00:00 PM": {
      message: " kumain naba kayo?"
    },
    "09:00:00 PM": {
      message: " matulog na kayo mga hangal😸"
    },
    "10:00:00 PM": {
      message: " gabi na nag puyat parin kayo💀🙏"
    },
    "11:00:00 PM": {
      message: " hinde mababawasan kapogian ng owner ko."
    }
  };

  const checkTimeAndSendMessage = () => {
    const now = moment().tz('Asia/Manila');
    const currentTime = now.format('hh:mm:ss A');

    const messageData = arrayData[currentTime];

    if (messageData) {
      const tid = global.db.allThreadData.map(i => i.threadID);
      tid.forEach(async (threadID) => {
        api.sendMessage({
          body: `《《𝗔𝘂𝘁𝗼 𝗦𝗰𝗵𝗲𝗱𝘂𝗹𝗲》》\n⏰ time now - ${currentTime}\n┃▬▬▬▬▬▬▬▬▬▬▬▬\n${messageData.message}\n┗━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣`
        }, threadID);
      });
    }

    const nextMinute = moment().add(1, 'minute').startOf('minute');
    const delay = nextMinute.diff(moment());
    setTimeout(checkTimeAndSendMessage, delay);
  };

  checkTimeAndSendMessage();
};

module.exports.onStart = () => {};
