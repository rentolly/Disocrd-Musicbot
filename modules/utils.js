// This function capitalizes the first letter of a string and converts the rest to lowercase
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// This function parses a time string in the format hh:mm:ss, mm:ss, or ss into seconds
export function parseTimeToSeconds(input) {
    const parts = input.split(':').map(Number);

    if (parts.some(isNaN)) return NaN;

    if (parts.length === 3) {
        // hh:mm:ss
        const [h, m, s] = parts;
        return h * 3600 + m * 60 + s;
    } else if (parts.length === 2) {
        // mm:ss
        const [m, s] = parts;
        return m * 60 + s;
    } else if (parts.length === 1) {
        // ss
        return parts[0];
    }

    return NaN;
}

// This function formats the given number of seconds into a time string in the format hh:mm:ss or mm:ss
export function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const padded = (n) => n.toString().padStart(2, '0');

    if (h > 0) {
        // hh:mm:ss
        return `${h}:${padded(m)}:${padded(s)}`;
    } else {
        // mm:ss
        return `${m}:${padded(s)}`;
    }
}
