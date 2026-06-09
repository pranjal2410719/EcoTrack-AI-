/**
 * Simple logging utility.
 */

const INFO = "INFO";
const WARN = "WARN";
const ERROR = "ERROR";

function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}`;
  console.log(logLine);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

module.exports = {
  info: (msg, data) => log(INFO, msg, data),
  warn: (msg, data) => log(WARN, msg, data),
  error: (msg, data) => log(ERROR, msg, data),
};
