/**
 * Simple logger for Expo Go debugging
 * Logs are stored in memory and can be viewed in the DebugLogs screen
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  tag: string;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 500;

  log(level: LogLevel, tag: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      tag,
      message,
      data,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also log to console
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    consoleMethod(`[${level.toUpperCase()}][${tag}]`, message, data || '');
  }

  info(tag: string, message: string, data?: any) {
    this.log('info', tag, message, data);
  }

  warn(tag: string, message: string, data?: any) {
    this.log('warn', tag, message, data);
  }

  error(tag: string, message: string, data?: any) {
    this.log('error', tag, message, data);
  }

  debug(tag: string, message: string, data?: any) {
    this.log('debug', tag, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  getLogsAsString(): string {
    return this.logs
      .map((log) => `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.tag}] ${log.message}${log.data ? ' ' + JSON.stringify(log.data) : ''}`)
      .join('\n');
  }
}

export const logger = new Logger();

// Convenience functions
export const logInfo = (tag: string, message: string, data?: any) => logger.info(tag, message, data);
export const logWarn = (tag: string, message: string, data?: any) => logger.warn(tag, message, data);
export const logError = (tag: string, message: string, data?: any) => logger.error(tag, message, data);
export const logDebug = (tag: string, message: string, data?: any) => logger.debug(tag, message, data);
