const { EmbedBuilder } = require("discord.js");

async function logCommand(client, interaction, command, details) {
    const channel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);

    if (!channel) return;

    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("📝 Command Used")
        .addFields(
            {
                name: "Moderator",
                value: `${interaction.user.tag}\n(${interaction.user.id})`,
                inline: true,
            },
            {
                name: "Command",
                value: `/${command}`,
                inline: true,
            },
            {
                name: "Server",
                value: interaction.guild?.name ?? "DM",
                inline: true,
            },
            {
                name: "Details",
                value: details,
            }
        )
        .setTimestamp();

    await channel.send({
        embeds: [embed],
    });
}

module.exports = {
    logCommand,
};