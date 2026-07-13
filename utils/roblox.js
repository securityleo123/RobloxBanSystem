const axios = require("axios");

async function getRobloxUser(username) {
    try {
        // Convert username -> user ID
        const response = await axios.post(
            "https://users.roblox.com/v1/usernames/users",
            {
                usernames: [username],
                excludeBannedUsers: false
            }
        );

        if (!response.data.data.length) {
            return null;
        }

        const user = response.data.data[0];

        return {
            id: user.id,
            name: user.name,
            displayName: user.displayName
        };

    } catch (err) {
        console.error("Roblox API Error:", err.response?.data || err.message);
        return null;
    }
}

module.exports = {
    getRobloxUser
};