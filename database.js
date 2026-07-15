const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bans.db", (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS bans (
            userid TEXT PRIMARY KEY,
            duration TEXT,
            reason TEXT,
            moderator TEXT,
            bannedAt INTEGER
        )
    `);
});

module.exports = db;