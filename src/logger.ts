import winston from 'winston'

function isSilent(env: string): boolean {
  return env !== 'development'
}

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  // format: winston.format.json(),
  transports: [new winston.transports.Console({})],
  silent: isSilent(process.env.NODE_ENV),
})

export default logger
