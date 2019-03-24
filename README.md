<p align="center">
  <img src="https://raw.githubusercontent.com/naminho/kychain/master/logo.png" alt="Kychain">
</p>

# kychain

> Store passwords in the macOS Keychain

## Installation

```
npm install kychain
```

## Usage

```js
import { get, set, remove } from 'kychain'

await set('hello_world')
const password = await get() // => password = 'hello_world'
await remove()
```

## Interface

`set(password, account, service, type)`

`get(account, service, type)`

`remove(account, service, type)`

`password: string` The password to be stored.

`account: string` Account under which the password should be stored, defaults to OS username.

`service: string` The name for the service under which to store the password, defaults to `kychain`.

`type: string` The password type can be `internet` or `generic` (the default).

# License

MIT, keychain access mostly taken from [keychain](https://www.npmjs.com/package/keychain) by Nicholas Penree.
