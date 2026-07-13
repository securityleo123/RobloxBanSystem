function parseDuration(duration) {
    if (duration.toLowerCase() === "perm") {
        return null;
    }

    const match = duration.match(/^(\d+)([mhd])$/i);

    if (!match) return false;

    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    let ms = 0;

    switch (unit) {
        case "m":
            ms = amount * 60 * 1000;
            break;
        case "h":
            ms = amount * 60 * 60 * 1000;
            break;
        case "d":
            ms = amount * 24 * 60 * 60 * 1000;
            break;
    }

    return Date.now() + ms;
}

module.exports = {
    parseDuration
};