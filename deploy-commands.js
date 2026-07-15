require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

console.log("Loading commands...");

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));

    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded: ${command.data.name}`);
    } else {
        console.log(`⚠ Skipped ${file} (missing data or execute)`);
    }
}

console.log(`\nFound ${commands.length} command(s):`);
console.log(commands.map(c => c.name));

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log("\nRegistering slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("✅ Slash commands registered successfully!");
    } catch (error) {
        console.error(error);
    }
})();