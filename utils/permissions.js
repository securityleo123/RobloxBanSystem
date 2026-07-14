function hasModeratorRole(interaction) {
    const moderatorRoleId = process.env.MODERATOR_ROLE_ID;

    if (!moderatorRoleId) {
        console.error("MODERATOR_ROLE_ID is missing from .env");
        return false;
    }

    return interaction.member.roles.cache.has(moderatorRoleId);
}

module.exports = {
    hasModeratorRole
};