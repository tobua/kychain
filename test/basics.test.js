import '@babel/polyfill'
import { set, get, remove } from './../src'

test('Throws an exception on unsupported platforms.', () => {
  expect(() => set('hello')).not.toThrow()

  // Change platform
  const platform = process.platform
  Object.defineProperty(process, 'platform', {
    value: 'other'
  })

  expect(() => set('hello')).toThrow()

  Object.defineProperty(process, 'platform', {
    value: platform
  })

  expect(() => set('hello')).not.toThrow()
})

test('Will throw an error if no or empty password is provided.', () => {
  expect(() => set('hello')).not.toThrow()
  expect(() => set()).toThrow()
  expect(() => set('')).toThrow()
})

test('Returns the stored password.', async () => {
  await set('hello')
  const result = await get()
  expect(result).toEqual('hello')
})

test('Removes password.', async () => {
  await set('hello')
  const found = await remove()
  expect(found).toBeUndefined()
  const notFound = await remove()
  expect(notFound).not.toBeUndefined()
})

test('Can set the password and receive it afterwards.', async () => {
  const error = await set('hello')
  expect(error).toBeUndefined()
  const result = await get()
  expect(result).toEqual('hello')
})

test('Works for all kinds of passwords', async () => {
  const specialChar = 'he2llo@#@!%$#@^%&*^'
  const whiteSpace = 'fdgs dsjfds_sdhj. fd'

  await set(specialChar)
  expect(await get()).toEqual(specialChar)

  await set(whiteSpace)
  expect(await get()).toEqual(whiteSpace)
})
