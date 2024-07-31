module.exports = {
	config: {
			name: "hi",
			version: "1.0",
			author: "Kaizenji",//olol
			countDown: 1,
			role: 0,
			shortDescription: "hi",
			longDescription: "response with hi",
			category: "box chat",
	},
onStart: async function(){}, 
onChat: async function({
	event,
	message,
	getLang
}) {
	if (event.body && event.body.toLowerCase() == "hi") return message.reply("Hello ma lil bro,how r u doin?");
  if (event.body && event.body.toLowerCase() == "henlo") return message.reply("Ayoo supp,ma lil bro,I'm horny to my owner,well that's weird asf🥹");
  if (event.body && event.body.toLowerCase() == "hii") return message.reply("hiiii, I'm mica, hello wanna be my friend?");
  if (event.body && event.body.toLowerCase() == "hello") return message.reply("hello, I'm mica,yknow what,in the first time i saw u,i krpt askin myself,why r u so attractive🥹😳?");
  if (event.body && event.body.toLowerCase() == "zup") return message.reply("Suppp,lil bro,what do u do for a livin?");
  if (event.body && event.body.toLowerCase() == "hey") return message.reply("heyy!! I'm mica I'm ur assistant 🎀?");
  if (event.body && event.body.toLowerCase() == "yo") return message.reply("yoooo,wsupp, I'm updating my cmds rn,what r u doin??");
}
};
