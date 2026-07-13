const {
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");

const db = require("../database");
const { parseDuration } = require("../utils");
const { hasModeratorRole } = require("../utils/permissions");
const { getRobloxUser } = require("../utils/roblox");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a Roblox player")
        .addStringOption(option =>
            option
                .setName("username")
                .setDescription("Roblox Username")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("Examples: 30m, 2h, 7d, perm")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the ban")
                .setRequired(true)
        ),

    async execute(interaction) {

        // Reply immediately so the interaction doesn't expire
        await interaction.deferReply();

        // Check moderator role
        if (!hasModeratorRole(interaction)) {
            return interaction.editReply({
                content: "❌ You do not have permission to use this command."
            });
        }

        const username = interaction.options.getString("username");
        const duration = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason");

        const expiresAt = parseDuration(duration);

        if (expiresAt === false) {
            return interaction.editReply({
                content: "❌ Invalid duration! Use 30m, 2h, 7d or perm."
            });
        }

        // Look up Roblox user
        const robloxUser = await getRobloxUser(username);

        if (!robloxUser) {
            return interaction.editReply({
                content: "❌ Roblox user not found."
            });
        }

        const userId = robloxUser.id.toString();

        db.run(
            `INSERT OR REPLACE INTO bans
            (userId, username, moderator, reason, duration, bannedAt, expiresAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                robloxUser.name,
                interaction.user.tag,
                reason,
                duration,
                Date.now(),
                expiresAt
            ],
            async (err) => {

                if (err) {
                    console.error(err);

                    return interaction.editReply({
                        content: "❌ Failed to save the ban."
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle("🔨 Roblox Player Banned")
                    .addFields(
                        {
                            name: "Username",
                            value: robloxUser.name,
                            inline: true
                        },
                        {
                            name: "Display Name",
                            value: robloxUser.displayName,
                            inline: true
                        },
                        {
                            name: "User ID",
                            value: userId,
                            inline: true
                        },
                        {
                            name: "Duration",
                            value: duration,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value: reason,
                            inline: false
                        },
                        {
                            name: "Moderator",
                            value: interaction.user.tag,
                            inline: true
                        },
                        {
                            name: "Expires",
                            value: expiresAt
                                ? `<t:${Math.floor(expiresAt / 1000)}:F>`
                                : "Permanent",
                            inline: true
                        }
                    )
                    .setTimestamp();

                await interaction.editReply({
                    embeds: [embed]
                });
            }
        );
    }
};