const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
	],
	partials: [Partials.Message, Partials.Reaction, Partials.User],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

Object.defineProperty(String.prototype, 'capFirst', {
	value: function() {
	  return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false,
});

// Map of emoji to role names
let roleMap = {
	'🤼': 'Adventurer',
	'🤺': 'Guardian',
	'🧙': 'Magic wielder',
};

const TARGET_MESSAGE_ID = '1353954120402210827';

client.once('ready', () => {
	console.log(`DUM-Admin is now logged in as ${client.user.tag}!`);
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (user.bot) return;
	if (reaction.message.id === TARGET_MESSAGE_ID) {
		const roleName = roleMap[reaction.emoji.name];
		if (!roleName) return;

		const guild = reaction.message.guild;
		const member = await guild.members.fetch(user.id);
		const role = guild.roles.cache.find(r => r.name === roleName);

		if (role && member) {
			await member.roles.add(role);
			console.log(`Added role ${roleName} to ${user.tag}`);
		}
	}
	else if (reaction.message.id === '1353949535172300892') {
	// Agreeing to terms assigns the "Player" role to the user, which unlocks the #game channel
		roleMap = {
			'✅': 'Player',
		};
		if (user.bot) return;

		const roleName = roleMap[reaction.emoji.name];
		if (!roleName) return;
		const guild = reaction.message.guild;
		const member = await guild.members.fetch(user.id);
		const role = guild.roles.cache.find(r => r.name === 'Player');
		if (role && member) {
			await member.roles.add(role);
			console.log(`Added role ${roleName} to ${user.tag}`);
		}
	}
	else {
		return;
	}
});

client.on('messageReactionRemove', async (reaction, user) => {
	if (reaction.message.id === TARGET_MESSAGE_ID) {
		if (user.bot) return;

		const roleName = roleMap[reaction.emoji.name];
		if (!roleName) return;

		const guild = reaction.message.guild;
		const member = await guild.members.fetch(user.id);
		const role = guild.roles.cache.find(r => r.name === roleName);

		if (role && member) {
			await member.roles.remove(role);
			console.log(`Removed role ${roleName} from ${user.tag}`);
		}
	}
	else if (reaction.message.id === '1353949535172300892') {
	// Agreeing to terms assigns the "Player" role to the user, which unlocks the #game channel
		roleMap = {
			'✅': 'Player',
		};
		if (user.bot) return;

		const roleName = roleMap[reaction.emoji.name];
		if (!roleName) return;
		const guild = reaction.message.guild;
		const member = await guild.members.fetch(user.id);
		const role = guild.roles.cache.find(r => r.name === 'Player');
		if (role && member) {
			await member.roles.remove(role);
			console.log(`Removed role ${roleName} from ${user.tag}`);
		}
	}
	else {
		return;
	}
});


client.on('messageCreate', (message) => {
	// console.log('message:', message);
		// Check if she is talking to herself
		// if (message.author.id === '1352327260866084906') {
		// message.reply('Stupid Parser bot.');
	// }
	if (message.author.bot) return;

	if (message.content.match(/^\//)) {
		message.reply('You can enter `/` without pressing any other keys to see the commands the DUM parser understands.');
	}
	if (message.content.match(/^Say(,|) ("|)good(| )night(,|)("|) DUM Bot(.|!|)$/i)) {
		message.reply('Good night, DUM Bot. :rolling_eyes:');
	}

	if (message.content.match(/fuck/i)) {
		message.react('🤘');
	}
	if (message.content.match(/^dm me, dum/i)){
		message.author.send('Ping!');
	}
	if (message.content.toLowerCase().trim() === 'ping') {
		message.reply('No.');
	}
	else if (message.content.toLowerCase().trim() === 'test') {
		message.reply('Fine.' + message.author.globalName + '. Your test is successful.');
	}
	else if (message.content.toLowerCase().trim() === 'tag me') {
		message.reply('<@!' + message.author + '>');
	}
	else if (message.content.toLowerCase().match(/good(bye|night)/)) {
		message.reply('Bye!');
	}
	else if (message.content.match(/\bDUM\b/i)) {
			message.react('👀');
	}
	if (message.content.match(/^\bh(e|a)llo|hi\b/i)) {
		message.react('👋');
	}
	if (message.content.match(/logic|reason/i)) {
		message.reply('👍');
	}
});
	
client.login(token);
