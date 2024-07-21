const fs = require('fs');  // Required for file operations
const path = require('path');
const moment = require('moment');
const transformCoordinates = require('./palworldCoordinates');

const playerLogFilePath = path.join(__dirname, '../data/playerLogData.json');
const playerLogFile = require(playerLogFilePath) || {};

console.log(playerLogFile)

function getTimeSince(eventTime) {
    let now = new Date();
    let past = new Date(eventTime);
    let diff = now - past;

    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days} day(s) ago`;
    } else if (hours > 0) {
        return `${hours} hour(s) ago`;
    } else if (minutes > 0) {
        return `${minutes} minute(s) ago`;
    } else {
        return `${seconds} second(s) ago`;
    }
}

function updatePlayerStatus(logEntry) {
    const { playername, event, timestamp, accountName } = logEntry;
    let player = playername || accountName;
    // console.log(player);
    if (player == ('REST' || '' || undefined)) return;

    // Check if player entry already exists
    if (!playerLogFile[player]) {
        playerLogFile[player] = {
            playerName: player,
            lastConnect: null,
            lastJoin: null,
            lastLeave: null,
            lastCommand: null,
            lastActivity: null,
            timeSinceLastConnect: null,
            timeSinceLastJoin: null,
            timeSinceLastLeave: null,
            timeSinceLastCommand: null,
            currentLevel: null,
            location_x: null,
            location_y: null,
        };
    }

    const playerRecord = playerLogFile[player];
    if (event) {
        // Update based on event type
        switch (event) {
            case 'connect':
                playerRecord.lastConnect = timestamp;
                playerRecord.lastActivity = timestamp;
                playerRecord.timeSinceLastConnect = getTimeSince(timestamp);
                break;
            case 'join':
                playerRecord.lastJoin = timestamp;
                playerRecord.lastActivity = timestamp;
                playerRecord.timeSinceLastJoin = getTimeSince(timestamp);
                break;
            case 'left':
                playerRecord.lastLeave = timestamp;
                playerRecord.lastActivity = timestamp;
                playerRecord.timeSinceLastLeave = getTimeSince(timestamp);
                break;
            case 'command':
                playerRecord.lastCommand = timestamp;
                playerRecord.lastActivity = timestamp;
                playerRecord.timeSinceLastCommand = getTimeSince(timestamp);
                break;
            default:
                console.log(`Unknown event type: ${event}`);
                break;
        }
    }
    if (logEntry.level) {
        console.log('LOGENTRY: \n', logEntry)
        playerRecord.currentLevel = logEntry.level;
        playerRecord.coords = transformCoordinates(logEntry.location_x, logEntry.location_y);
    }


    // Save updated player data to JSON file
    fs.writeFileSync(playerLogFilePath, JSON.stringify(playerLogFile, null, 2), 'utf8');
}

module.exports = { updatePlayerStatus, playerLogFile }