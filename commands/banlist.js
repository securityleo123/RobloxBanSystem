const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");

const db = require("../database");
const { hasModeratorRole } = require("../utils/permissions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banlist")
        .setDescription("View all active Roblox bans"),

    async execute(interaction) {

        if (!hasModeratorRole(interaction)) {
            return interaction.reply({
                content: "❌ You do not have permission to use this command.",
                ephemeral: true
            });
        }

        await interaction.deferReply();

        db.all(
            "SELECT * FROM bans ORDER BY bannedAt DESC",
            [],
            (err, rows) => {

                if (err) {
                    console.error(err);

                    return interaction.editReply("❌ Failed to load bans.");
                }

                if (rows.length === 0) {
                    return interaction.editReply("✅ There are currently no active bans.");
                }

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("🔨 Active Roblox Bans")
                    .setTimestamp();

                rows.slice(0, 10).forEach(ban => {

                    let expires = "Permanent";

                    if (ban.expiresAt) {
                        expires = `<t:${Math.floor(ban.expiresAt / 1000)}:R>`;
                    }

                    embed.addFields({
                        name: `${ban.username} (${ban.userId})`,
                        value:
`**Reason:** ${ban.reason}
**Moderator:** ${ban.moderator}
**Expires:** ${expires}`,
                        inline: false
                    });

                });

                if (rows.length > 10) {
                    embed.setFooter({
                        text: `Showing 10 of ${rows.length} active bans`
                    });
                }

                interaction.editReply({
                    embeds: [embed]
                });

            }
        );
    }
};