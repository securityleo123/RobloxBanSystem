require("dotenv").config();

function hasModeratorRole(interaction) {
    const roleId = process.env.DISCORD_BAN_ROLE_ID;

    if (!roleId) {
        console.error("❌ DISCORD_BAN_ROLE_ID is missing from .env");
        return false;
    }

    if (!interaction.member || !interaction.member.roles) {
        console.error("❌ Could not access member roles.");
        return false;
    }

    console.log("=================================");
    console.log("Required Role ID:", roleId);
    console.log(
        "User Roles:",
        interaction.member.roles.cache.map(role => ({
            name: role.name,
            id: role.id
        }))
    );
    console.log("=================================");

    return interaction.member.roles.cache.has(roleId);
}

module.exports = {
    hasModeratorRole
};