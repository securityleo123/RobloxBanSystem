require("dotenv").config();

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

const fs = require("fs");
const path = require("path");
const {
    Client,
    Collection,
    GatewayIntentBits,
    Events,
} = require("discord.js");

console.log("Starting Roblox Ban Bot...");

// Check environment variables
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN was not found in your .env file!");
    process.exit(1);
}

if (!process.env.CLIENT_ID) {
    console.error("❌ CLIENT_ID was not found in your .env file!");
    process.exit(1);
}

if (!process.env.GUILD_ID) {
    console.error("❌ GUILD_ID was not found in your .env file!");
    process.exit(1);
}

console.log("✅ Environment variables loaded.");

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));

    if (!command.data || !command.execute) {
        console.warn(`⚠ Skipping ${file} (missing data or execute).`);
        continue;
    }

    client.commands.set(command.data.name, command);
}

console.log(`✅ Loaded ${client.commands.size} command(s).`);

client.once(Events.ClientReady, () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "❌ An error occurred while executing this command.",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "❌ An error occurred while executing this command.",
                ephemeral: true,
            });
        }
    }
});

console.log("Connecting to Discord...");

client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log("✅ Login request sent.");
    })
    .catch(error => {
        console.error("❌ Failed to login:");
        console.error(error);
    });