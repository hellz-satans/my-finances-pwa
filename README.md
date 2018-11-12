# my-finances

Expenses record keeper without a back-end -- easy to use, easy to erase.

I have a hard time keeping record on what I spend my money and, since I'm a bit
paranoid with my phone and apps, I wrote this simple application to keep a
record and easily dispose the information.

It uses browser's IndexedDB through [Dexie.js](https://dexie.org) and
[Vue](https://vuejs.org) with [VueX](https://vuex.vuejs.org/) for state
management.

## TODO:

- [ ] Add webpack configuration and stop using CDNs
- [ ] Use [vue-components](https://vuejs.org/v2/guide/single-file-components.html)
- [ ] Secure IndexedDB with password (is it even possible?)