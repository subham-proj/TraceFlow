export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

interface LoggerConfig {
  level: LogLevel;
  prefix: string;
  enableColors: boolean;
}

// Default configuration
const config: LoggerConfig = {
  level:
    process.env.NODE_ENV === "development" ? LogLevel.DEBUG : LogLevel.INFO,
  prefix: "[TraceFlow]",
  enableColors: true,
};

const getColor = (level: LogLevel): string => {
  if (!config.enableColors) return "";

  const colors: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: "\x1b[36m", // Cyan
    [LogLevel.INFO]: "\x1b[32m", // Green
    [LogLevel.WARN]: "\x1b[33m", // Yellow
    [LogLevel.ERROR]: "\x1b[31m", // Red
    [LogLevel.NONE]: "",
  };
  return colors[level] || "";
};

const resetColor = (): string => {
  return config.enableColors ? "\x1b[0m" : "";
};

const formatMessage = (level: string, message: string): string => {
  const timestamp = new Date().toISOString();
  return `${timestamp} ${config.prefix} ${level} ${message}`;
};

export const debug = (message: string, ...args: any[]): void => {
  if (config.level <= LogLevel.DEBUG) {
    console.debug(
      getColor(LogLevel.DEBUG) + formatMessage("DEBUG", message) + resetColor(),
      ...args
    );
  }
};

export const info = (message: string, ...args: any[]): void => {
  if (config.level <= LogLevel.INFO) {
    console.info(
      getColor(LogLevel.INFO) + formatMessage("INFO", message) + resetColor(),
      ...args
    );
  }
};

export const warn = (message: string, ...args: any[]): void => {
  if (config.level <= LogLevel.WARN) {
    console.warn(
      getColor(LogLevel.WARN) + formatMessage("WARN", message) + resetColor(),
      ...args
    );
  }
};

export const error = (message: string, ...args: any[]): void => {
  if (config.level <= LogLevel.ERROR) {
    console.error(
      getColor(LogLevel.ERROR) + formatMessage("ERROR", message) + resetColor(),
      ...args
    );
  }
};

// Optional: Allow updating config at runtime
export const setLogLevel = (level: LogLevel): void => {
  config.level = level;
};

export const setPrefix = (prefix: string): void => {
  config.prefix = prefix;
};

export const setEnableColors = (enable: boolean): void => {
  config.enableColors = enable;
};
