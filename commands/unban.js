const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");

const db = require("../database");
const { hasModeratorRole } = require("../utils/permissions");
const { getRobloxUser } = require("../utils/roblox");
const { logCommand } = require("../utils/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a Roblox player")
        .addStringOption(option =>
            option
                .setName("username")
                .setDescription("Roblox Username")
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        if (!hasModeratorRole(interaction)) {
            return interaction.editReply({
                content: "❌ You do not have permission to use this command."
            });
        }

        const username = interaction.options.getString("username");

        const robloxUser = await getRobloxUser(username);

        if (!robloxUser) {
            return interaction.editReply({
                content: "❌ Roblox user not found."
            });
        }

        const userId = robloxUser.id.toString();

        db.run(
            "DELETE FROM bans WHERE userId = ?",
            [userId],
            async (err) => {

                if (err) {
                    console.error(err);

                    return interaction.editReply({
                        content: "❌ Failed to unban the player."
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle("✅ Roblox Player Unbanned")
                    .addFields(
                        { name: "Username", value: robloxUser.name, inline: true },
                        { name: "Display Name", value: robloxUser.displayName, inline: true },
                        { name: "User ID", value: userId, inline: true },
                        { name: "Moderator", value: interaction.user.tag }
                    )
                    .setTimestamp();

                await interaction.editReply({
                    embeds: [embed]
                });

                await logCommand(
                    interaction,
                    "✅ Roblox Player Unbanned",
                    0x00ff00,
                    `**Player:** ${robloxUser.name}
**User ID:** ${userId}`
                );
            }
        );
    }
};