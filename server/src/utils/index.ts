import winston from 'winston'

export * from './currentHeat.js'
export * from './rsync.js'

export function nullToUndefined<T>(type: T | null): T | undefined {
  if (type === null) return
  return type
}

export function setupLogger(name: string) {
  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((options) => {
      return `${options.timestamp} [${options.moduleName}] ${options.level}: ${options.message}`
    })
  )
  const logfileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((options) => {
      return `${options.timestamp} [${options.moduleName}] ${options.level}: ${options.message}`
    })
  )
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({ format: consoleFormat }),
      new winston.transports.File({
        filename: 'logfile.log',
        format: logfileFormat,
      }),
    ],
  })
  return logger.child({ moduleName: name })
}
