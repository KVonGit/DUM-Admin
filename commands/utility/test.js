const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test DUM-Admin\'s connection'),
	async execute(interaction) {
		await interaction.reply({ content: 'PING DUM-ADMIN (127.0.0.1) 56(84) bytes of data.', flags: 64 });
		await interaction.followUp({ content: `64 bytes from dumserv.net (127.0.1.1): icmp_seq=${0 + 1} ttl=106 time=${Date.now()} ms`, flags: 64 });
		await interaction.followUp({ content: `64 bytes from dumserv.net (127.0.1.1): icmp_seq=${0 + 2} ttl=106 time=${Date.now()} ms`, flags: 64 });
		await interaction.followUp({ content: `64 bytes from dumserv.net (127.0.1.1): icmp_seq=${0 + 3} ttl=106 time=${Date.now()} ms`, flags: 64 });
	},
};
