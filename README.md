# my-finances

Expenses record keeper without a back-end -- easy to use, easy to erase.

I have a hard time keeping record on what I spend my money and, since I'm a bit
paranoid with my phone and apps, I wrote this simple application to keep a
record and easily dispose the information.

It uses browser's IndexedDB through [Dexie.js](https://dexie.org) and
[Vue](https://vuejs.org) with [VueX](https://vuex.vuejs.org/) for state
management and [VueChartJs](https://vue-chartjs.org) for charts.

## TODO:

- [ ] Add webpack configuration and stop using CDNs
- [ ] Use [vue-components](https://vuejs.org/v2/guide/single-file-components.html)
- [ ] Secure IndexedDB with password, in case data export functionality
is added ([crypto-js](https://github.com/brix/crypto-js))
- [ ] [A2HS](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready),
[using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)