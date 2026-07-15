const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bans.db", (err) => {
    if (err) {
        console.error("❌ SQLite Error:", err);
    } else {
        console.log("✅ Connected to SQLite.");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS bans (
            userId TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            moderator TEXT NOT NULL,
            reason TEXT NOT NULL,
            duration TEXT NOT NULL,
            bannedAt INTEGER NOT NULL,
            expiresAt INTEGER
        )
    `);

});

module.exports = db;