const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot's latency."),

    async execute(interaction) {

        await interaction.deferReply();

        const apiPing = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("🏓 Pong!")
            .addFields(
                {
                    name: "Bot Status",
                    value: "🟢 Online",
                    inline: true
                },
                {
                    name: "Discord API Ping",
                    value: `${apiPing} ms`,
                    inline: true
                },
                {
                    name: "Response",
                    value: `${Date.now() - interaction.createdTimestamp} ms`,
                    inline: true
                }
            )
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed]
        });
    }
};