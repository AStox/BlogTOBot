const fs = require("fs");
const logFilePath = "../log.log";

// Function to log a message
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${message}\n`;

  fs.appendFileSync(logFilePath, logEntry);
}

module.exports = {
  logMessage,
};
