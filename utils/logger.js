const { EmbedBuilder } = require("discord.js");

async function logCommand(interaction, title, color, details) {
    console.log("📝 Logger called");

    const channelId = process.env.LOG_CHANNEL_ID;

    console.log("LOG_CHANNEL_ID:", channelId);

    if (!channelId) {
        console.log("❌ LOG_CHANNEL_ID is missing!");
        return;
    }

    try {
        const channel = await interaction.client.channels.fetch(channelId);

        console.log("Fetched channel:", channel?.name);

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                {
                    name: "Moderator",
                    value: `${interaction.user.tag}\n(${interaction.user.id})`,
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

        await channel.send({ embeds: [embed] });

        console.log("✅ Log sent successfully!");
    } catch (err) {
        console.error("❌ Logger Error:");
        console.error(err);
    }
}

module.exports = {
    logCommand,
};