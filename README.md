# my-finances

Expenses record keeper without a back-end -- easy to use, easy to erase.

It's hard keeping record on what you spend money, and if you're a bit
paranoid with your phone and apps, it continues to be hard. We're writing
this simple application to keep a record and easily dispose the information
-- **or not!** We're also writing a cloud storage for the information,
but that comes later.

The **first phase** of the project consists of a Progressive Web Application
using [Vue](https://vuejs.org) and browsers' IndexedDB through
[Dexie.js](https://dexie.org).

The **second phase** will be a service to store the records safely
in the cloud.

The **third phase** will be a native android application.

## TODO:

- [x] Add webpack configuration and stop using CDNs
- [x] Use [vue-components](https://vuejs.org/v2/guide/single-file-components.html)
- [ ] Secure IndexedDB with password, in case data export functionality
is added ([crypto-js](https://github.com/brix/crypto-js))
- [ ] [A2HS](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready),
[using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
