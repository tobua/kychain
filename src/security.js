import { spawn } from 'child_process'
import { remove } from './'

const securityPath = '/usr/bin/security'

// Runs security command with the proper flags and passes the output back.
export default (command, result, done) => {
  const security = spawn(securityPath, command)

  let output = ''

  security.on('error', () => {
    console.log('Error when running security.')
  })

  // Last line containing the password get's wriiten to stderr.
  security.stderr.on('data', data => {
    output += data.toString()
  })

  // Pass back result code and possible output.
  security.on('close', async (code, signal) => {
    result(code, output, done)
  })
}
