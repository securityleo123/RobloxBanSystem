const { EmbedBuilder } = require("discord.js");

async function logCommand(interaction, title, color, details) {
    const channelId = process.env.LOG_CHANNEL_ID;

    if (!channelId) {
        console.log("❌ LOG_CHANNEL_ID is missing.");
        return;
    }

    try {
        const channel = await interaction.client.channels.fetch(channelId);

        if (!channel) {
            console.log("❌ Log channel not found.");
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                {
                    name: "Moderator",
                    value: `${interaction.user.tag}\n(${interaction.user.id})`,
                    inline: true
                },
                {
                    name: "Server",
                    value: interaction.guild?.name ?? "DM",
                    inline: true
                },
                {
                    name: "Details",
                    value: details
                }
            )
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        });

        console.log("✅ Command log sent.");
    } catch (err) {
        console.error("❌ Failed to send command log:", err);
    }
}

module.exports = {
    logCommand
};