function convertUtcToGmt7(utcDateString, gmt = null, end = null) {
    const utcDate = new Date(utcDateString);

    let gmt7Date = new Date(utcDate.getTime() + 7 * 3600 * 1000);
    if (end) {
        gmt7Date = new Date(utcDate.getTime() + 30 * 3600 * 1000 + 59 * 61 * 1000);
    }

    if (gmt) {
        return gmt7Date;
    }

    const formattedDate = gmt7Date.toISOString().slice(0, 10);

    return formattedDate;
}

module.exports = convertUtcToGmt7