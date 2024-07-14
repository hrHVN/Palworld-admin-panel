function organizeLogData(input) {
    const lines = input.split('\n');
    const result = {
        arrayOfStrings: [],
        arrayOfObjects: []
    };

    lines.forEach(line => {
        line = line.trim(); // Trim any leading or trailing whitespace

        if (line.startsWith('{') && line.endsWith('}')) {
            try {
                const obj = JSON.parse(line);
                result.arrayOfObjects.push(obj);
            } catch (error) {
                // If parsing fails, treat it as a string
                result.arrayOfStrings.push(line);
            }
        } else {
            result.arrayOfStrings.push(line);
        }
    });

    return result;
}

module.exports = organizeLogData;