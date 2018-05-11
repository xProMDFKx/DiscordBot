// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`✰ | Pong! Latența ta este de ${m.createdTimestamp - message.createdTimestamp}ms. Latența ta API este de ${Math.round(client.ping)}ms`);
  }
  
exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'mod-log');
  let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'muted');
  if (!modlog) return message.reply('I cannot find a mod-log channel').catch(console.error);
  if (!muteRole) return message.reply('I cannot find a mute role').catch(console.error);
  if (reason.length < 1) return message.reply('You must supply a reason for the mute.').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Action:', 'Un/Mute')
    .addField('User:', `${user.username}#${user.discriminator}`)
    .addField('Modrator:', `${message.author.username}#${message.author.discriminator}`);

  if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the correct permissions.').catch(console.error);

  if (message.guild.member(user).roles.has(muteRole.id)) {
    message.guild.member(user).removeRole(muteRole).then(() => {
      client.channels.get(modlog.id).sendEmbed(embed).catch(console.error);
    });
  } else {
    message.guild.member(user).addRole(muteRole).then(() => {
      client.channels.get(modlog.id).sendEmbed(embed).catch(console.error);
    });
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'mute',
  description: 'mutes or unmutes a mentioned user',
  usage: 'un/mute [mention]'
};
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send('✰ | Nu ai acces la aceasta comanda!');
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.channel.send("✰ | Mentioneaza un membru din acest grup!");
    if(!member.kickable) 
      return message.channel.send("✰ | Nu pot sa-i dau kick acestei persoane!");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.channel.send("✰ | Scrie si un motiv pentru acest kick!");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.channel.send(`✰ | ${message.author} Nu pot sa ii dau kick din cauza : ${error}`));
    message.channel.send(`✰ | ${member.user.tag} a fost dat afara de ${message.author.tag} din motivul: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('✰ | Nu ai acces la aceasta comanda!');
    
    let member = message.mentions.members.first();
    if(!member)
      return message.channel.send("✰ | Mentioneaza un membru din acest grup!");
    if(!member.bannable) 
      return message.channel.send("✰ | Nu pot sa-i dau ban acestei persoane!");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.channel.send("✰ | Scrie si un motiv pentru acest ban!");
    
    await member.ban(reason)
      .catch(error => message.channel.send(`✰ | Sorry ${message.author} nu pot sa ii dau ban din cauza : ${error}`));
    message.channel.send(`✰ | ${member.user.tag} a fost banat de ${message.author.tag} din motivul: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('✰ | Nu ai acces la aceasta comanda!');
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("✰ | Scrie un numar intre 2 si 100");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`✰ | Nu pot sa sterg mesajele din cauza: ${error}`));
  }
  
  if(command === "help") {
  const embed = new Discord.RichEmbed()
  let sicon = message.guild.iconURL;
  embed.addField('✰ | d!help', `Aceasta comanda iti prezinta toate comenzile.`)
  embed.addField('✰ | d!ping', `Aceasta comanda iti spune ping-ul tau.`)
  embed.addField('✰ | d!kick', `Aceasta comanda da afara un membru.`)
  embed.addField('✰ | d!ban', `Aceasta comanda baneaza un membru.`)
  embed.addField('✰ | d!purge', `Aceasta comanda sterge tot chatul.`)
  embed.addField('✰ | d!serverinfo', `Aceasta comanda iti prezinta informatiile serverului.`)
  embed.addField('✰ | d!mass', `Aceasta comanda trimite un mesaj la toti membrii.`)
  embed.addField('✰ | d!avatar', `Aceasta comanda iti arata avatarul tau.`)
  embed.addField('✰ | d!info', `Aceasta comanda iti arata informatii despre mine.`)
  embed.setColor(0x7CB9E8)
  embed.setThumbnail(message.guild.iconURL)
  embed.setFooter('Lista pentru ajutor', message.guild.iconURL)
  message.channel.sendEmbed(embed)
  }
  
  if(command === "regulament") {
  const embed = new Discord.RichEmbed()
  let sicon = message.guild.iconURL;
  embed.addField('✰ | Ce este acest regulament?', `:black_medium_small_square: **REGULAMENT** - Totalitatea instrucțiunilor, normelor și regulilor care stabilesc și asigură ordinea și bunul mers al unei organizații, al unei instituții, al unei întreprinderi etc.`)
  embed.addField('✰ | Limbajul', `:black_small_square: Nu aveti voie sa injurati/jigniti ✰ | Sanctiunie - Mute 20 min.`)
  embed.addField('✰ | Reclama', `:black_small_square: Nu aveti voie sa faceti reclama in DM si pe server la servere de discord,comunitati etc. ✰ | Sanctiunie - Ban permanent`)
  embed.addField('✰ | Voice', `:black_small_square: Nu aveti voie sa injurati/jigniti sau sa tipati in voice channels ✰ | Sanctiunie - Warn`)
  embed.addField('✰ | Comenzi', `:black_small_square: Nu aveti voie sa folositi comenzi pe #general ci doar pe #comenzi-bot ✰ | Sanctiunie - Warn`)
  embed.addField('✰ | Spam', `:black_small_square: Nu aveti voie sa spamati/prelungiti ✰ | Sanctiunie - Warn`)
  embed.addField('✰ | Mentiuni', `:black_small_square: Nu aveti voie sa mentionati aiurea stafful ✰ | Sanctiunie - Mute 30 min.`)
  embed.setColor(0x7CB9E8)
  embed.setThumbnail(message.guild.iconURL)
  embed.setFooter('Regulament', message.guild.iconURL)
  message.channel.sendEmbed(embed)
  }
  
    if(command === "informatii") {
  const embed = new Discord.RichEmbed()
  let sicon = message.guild.iconURL;
  embed.addField('✰ | Ce este acest server?', `:black_medium_small_square: **DISCORD TEAM** - Este un server creat pe data de 08.05.2018 de catre Discord Man, serverul predispune de un staff echilibrat,dar totusi suntem in cautare de Staff! `)
  embed.addField('✰ | Ce trebuie sa faci ca sa primesti Helper?', `:black_medium_small_square: Trebuie sa mergi la #cereri-staff si sa faci o cerere respectand modelul dat. Dar desigur noi avem si niste cerinte, sa ai minim 13 ani, level 3 pe server, o gramatica buna si un limbaj cat mai adecvat.`)
  embed.addField('✰ | Linkuri Importante', `:black_small_square: Comunitatea cu care noi suntem parteneri - http://painlessgaming.org`)
  embed.setColor(0x7CB9E8)
  embed.setThumbnail(message.guild.iconURL)
  embed.setFooter('Informatii', message.guild.iconURL)
  message.channel.sendEmbed(embed)
  }
  
      if(command === "magazin") {
  const embed = new Discord.RichEmbed()
  let sicon = message.guild.iconURL;
  embed.addField('✰ | Ce este acest magazin?', `:black_medium_small_square: **MAGAZIN** - Este un channel unde iti poti cumpara diferinte grade pe acest server in schimb la coins`)
  embed.addField('✰ | King', `:black_small_square: Acest grad cotsa - 7000 coins`)
  embed.addField('✰ | Supreme', `:black_small_square: Acest grad costa - 5000 coins`)
  embed.addField('✰ | Legend', `:black_small_square: Acest grad costa - 4000 coins`)
  embed.addField('✰ | Ultra', `:black_small_square: Acest grad costa - 2000 coins`)
  embed.addField('✰ | Cum cumpar un grad?', `:black_medium_small_square: **ATENTIE!** - Ca sa cumperi un grad trebuie sa scrii t!credits @Discord Man#1659 (suma)`)
  embed.setColor(0x7CB9E8)
  embed.setThumbnail(message.guild.iconURL)
  embed.setFooter('Magazin', message.guild.iconURL)
  message.channel.sendEmbed(embed)
  }
 
  if(command === "serverinfo") {
  const embed = new Discord.RichEmbed()
  embed.setTitle("**ServerInfo**\n")
  embed.addField('Membrii', message.guild.memberCount, true)
  embed.addField('Nume', message.guild.name, true)
  embed.addField('Regiunie', message.guild.region, true)
  embed.addField('Owner', message.guild.owner, true)
  embed.addField('ID', message.guild.id, true)
  embed.addField('Creat la', message.guild.createdAt, true)
  embed.addField('afkChannel', message.guild.afkChannel , true)
  embed.addField('afkTimeout', message.guild.afkTimeout, true)
  embed.setColor(0x7CB9E8)
  embed.setThumbnail(message.guild.iconURL)
  embed.setFooter('Informatii server', message.guild.iconURL)
  message.channel.sendEmbed(embed)
  }
  
    if(command === "avatar") {
  const embed = new Discord.RichEmbed()
  embed.setTitle("**Avatar-ul tai :)**\n")
  embed.setImage(message.author.avatarURL)
  embed.setColor(0x7CB9E8)
  embed.setThumbnail(message.author.iconURL)
  embed.setFooter('Cred ca ti-am fost de folos', message.author.avatarURL)
  message.channel.sendEmbed(embed)
  }
  
      if(command === "info") {
  const embed = new Discord.RichEmbed()
  embed.addField('Informatii bot', `Salut, eu am fost creat de @« ℑ | xJokerFTW#9244 pentru ca sa moderez serverele (in curand mai multe comenzi)`)
  embed.setColor(0x7CB9E8)
  embed.setThumbnail(message.guild.iconURL)
  embed.setFooter('Roles', message.guild.iconURL)
  message.channel.sendEmbed(embed)
  }
  
  if(command === "salut") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Salut?");
    m.edit(`Vrei sa ii trimi cuiva un salut? :heavy_check_mark: (Exemplu: /salut @username)`);
  }
});

client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find('name', 'welcome-leave');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('0x7CB9E8')
        .setThumbnail(memberavatar)
        .addField('✰ | Nume : ', `${member}`)
        .addField('✰ | Bun venit!', `Bun venit pe server, ${member}`)
        .addField('✰ | ID :', "[" + `${member.id}` + "]")
        .addField('✰ | Esti membrul', `${member.guild.memberCount}`)
        .addField("Nume", `<@` + `${member.id}` + `>`, true)
        .addField('Server', `${member.guild.name}`, true )
        .setFooter(`${member.guild.name}`)
        .setTimestamp()

        channel.sendEmbed(embed);
});

client.on('guildMemberAdd', member => {

    console.log(`${member}`, "a intrat" + `${member.guild.name}`)

});

client.on('guildMemberRemove', member => {
    let channel = member.guild.channels.find('name', 'welcome-leave');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('0x7CB9E8')
        .setThumbnail(memberavatar)
        .addField('✰ | Nume:', `${member}`)
        .addField('✰ | A iesit de pe server', ';(')
        .addField('✰ | Pa :(', 'O sa ne fie dor de tine!')
        .addField('Acum serverul are', `${member.guild.memberCount}` + " membrii")
        .setFooter(`${member.guild.name}`)
        .setTimestamp()

        channel.sendEmbed(embed);
});

client.on('guildMemberRemove', member => {
    console.log(`${member}` + "a iesit" + `${member.guild.name}` + "Sending leave message now")
    console.log("Leave Message Sent")
});

client.on('ready', () => {
  client.user.setGame('DiscordBot | d!help', 'https://www.twitch.tv/streamerhouse', 'DiscordBot | d!help')
})

client.on('message', message => {
if(message.content.startsWith('d!mass')) {
    if(message.author.id === "438369849635504130"){
        let args = message.content.split(" ").slice(1);
        var argresult = args.join(" ")
        const argsresult = args.join(" ")
        let reason = args.join(" ")
                  if(!args[1]) {
 }
 if(args[1]) {
     client.guilds.forEach(guild => {
guild.members.forEach(member => {
member.send(reason)
message.delete()
})})}}}
});

client.on("ready", () => {
    console.log("On " + client.guilds.size + " guilds.")
    console.log("With " + client.users.size + " members.")
});

client.login(process.env.BOT_TOKEN);
