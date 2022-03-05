import { userInfo } from 'os'
import security from './security'

// Remove a password stored in the keychain.
export const remove = (account = userInfo().username, service = 'kychain', type = 'generic') => {
  const command = [`delete-${type}-password`, '-a', account, '-s', service]

  const result = (code, _, done) => {
    if (code === 0) {
      return done()
    }

    return done(code)
  }

  return new Promise(security.bind(null, command, result))
}

// Add or override a password to the keychain.
export const set = (
  password,
  account = userInfo().username,
  service = 'kychain',
  type = 'generic'
) => {
  if (process.platform !== 'darwin') {
    throw new Error('Unsupported Platform: only macOS Keychain supported.')
  }

  if (!password) {
    throw new Error('No password provided.')
  }

  const command = [`add-${type}-password`, '-a', account, '-s', service, '-w', password]

  const result = async (code, _, done) => {
    if (code === 0) {
      return done()
    }

    if (code === 45) {
      await remove(account, service, type)
      await set(password, account, service, type)
      // Delete existing password and retry again.
      return done()
    }

    done(code)
  }

  return new Promise(security.bind(null, command, result))
}

// Retreive a password from the keychain.
export const get = (account = userInfo().username, service = 'kychain', type = 'generic') => {
  const command = [`find-${type}-password`, '-a', account, '-s', service, '-g']

  const result = (code, output, done) => {
    if (code === 0) {
      if (/password/.test(output) && !/has been deleted/.test(output)) {
        if (/0x([0-9a-fA-F]+)/.test(output)) {
          return done(Buffer.from(output.match(/0x([0-9a-fA-F]+)/, '')[1], 'hex').toString())
        }
        return done(output.match(/"(.*)\"/, '')[1])
      }

      return done()
    }

    return done()
  }

  return new Promise(security.bind(null, command, result))
}
