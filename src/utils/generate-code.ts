import { randomBytes, randomInt } from 'crypto'

export const generateVerifyCode = (length = 6) => {
  const start = parseInt('1'.padEnd(length, '0'), 10)
  const end = parseInt('9'.padEnd(length, '9'), 10)
  return `${randomInt(start, end)}`
}

export const generateRandom = (length = 8) => {
  const buffer = randomBytes(length)
  return buffer.toString('base64').replace(/\W/g, '')
}
