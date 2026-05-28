import { config } from '../config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m',   // gray
  info: '\x1b[36m',    // cyan
  warn: '\x1b[33m',    // yellow
  error: '\x1b[31m',   // red
  fatal: '\x1b[41m',   // red bg
};

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const minLevel: LogLevel = config.isDev ? 'debug' : 'info';

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, component: string, message: string, meta?: Record<string, unknown>): string {
  const color = LEVEL_COLORS[level];
  const tag = `${color}${BOLD}[${level.toUpperCase()}]${RESET}`;
  const comp = `\x1b[35m[${component}]${RESET}`;
  const ts = `\x1b[90m${formatTimestamp()}${RESET}`;
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} ${tag} ${comp} ${message}${metaStr}`;
}

function createLogger(component: string) {
  return {
    debug(message: string, meta?: Record<string, unknown>) {
      if (shouldLog('debug')) console.log(formatMessage('debug', component, message, meta));
    },
    info(message: string, meta?: Record<string, unknown>) {
      if (shouldLog('info')) console.log(formatMessage('info', component, message, meta));
    },
    warn(message: string, meta?: Record<string, unknown>) {
      if (shouldLog('warn')) console.warn(formatMessage('warn', component, message, meta));
    },
    error(message: string, meta?: Record<string, unknown>) {
      if (shouldLog('error')) console.error(formatMessage('error', component, message, meta));
    },
    fatal(message: string, meta?: Record<string, unknown>) {
      if (shouldLog('fatal')) console.error(formatMessage('fatal', component, message, meta));
    },
  };
}

export const log = createLogger('EPHEMERAL');
export { createLogger };
