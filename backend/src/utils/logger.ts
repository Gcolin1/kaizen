export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  error(message: string, meta?: any): void {
    const formatted = this.formatMessage(LOG_LEVELS.ERROR, message, meta);
    console.error(formatted);
  }

  warn(message: string, meta?: any): void {
    const formatted = this.formatMessage(LOG_LEVELS.WARN, message, meta);
    console.warn(formatted);
  }

  info(message: string, meta?: any): void {
    const formatted = this.formatMessage(LOG_LEVELS.INFO, message, meta);
    console.info(formatted);
  }

  debug(message: string, meta?: any): void {
    if (this.isDevelopment) {
      const formatted = this.formatMessage(LOG_LEVELS.DEBUG, message, meta);
      console.debug(formatted);
    }
  }

  // Método para log de requisições HTTP
  request(req: any, res: any, duration?: number): void {
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode}`;
    const meta = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      duration: duration ? `${duration}ms` : undefined,
    };
    
    if (res.statusCode >= 400) {
      this.error(message, meta);
    } else {
      this.info(message, meta);
    }
  }
}

export const logger = new Logger();