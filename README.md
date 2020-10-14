# my-finances

Expenses record keeper without a back-end -- easy to use, easy to erase.

It's hard keeping record on what you spend money, and if you're a bit
paranoid with your phone and apps, it continues to be hard. We're writing
this simple application to keep a record and easily dispose the information
-- **or not!** We're also writing a cloud storage for the information,
but that comes later.

## [Demo](https://hellz-satans.github.io/my-finances-pwa)

The **first phase** of the project consists of a Progressive Web Application
using [Vue](https://vuejs.org) and browsers' IndexedDB through
[Dexie.js](https://dexie.org).

The **second phase** will be a service to store the records safely
in the cloud.

The **third phase** will be a native android application.

## Deployment

The [Dockerfile](Dockerfile) is published at Docker HUB as
[juankman94/myfinances](https://cloud.docker.com/u/juankman94/repository/docker/juankman94/myfinances)

```bash
$ docker run --rm -v $PWD:/app juankman94/myfinances ./deploy
```

**NOTE**: you probably have to mount your SSH keys as well, so add
`-v $HOME/.ssh:/root/.ssh`

## References

* [Heroku: How to make a Progressive Web Application](https://blog.heroku.com/how-to-make-progressive-web-app)
* [Color Theory], by [tallys]
* [Tailwind CSS](https://tailwindcss.com/)
* [Audi's UI guidelines]

## Production

| File | Semantic UI | Tailwind | Vue 3 & Tailwind |
| :--: | :---------: | :------: | :--------------: |
| index.html | 1.61 KB | 1.61 KB |  |
| chunk.vendors.js | 1.36 MB | 1.24 MB |  |
| app.js | 71.64 KB | 77.55 KB |  |
| total | 1.433 MB | 1.319 MB |  |

## TODO:

- [x] Add webpack configuration and stop using CDNs
- [x] Use [vue-components](https://vuejs.org/v2/guide/single-file-components.html)
- [ ] Secure IndexedDB with password, in case data export functionality
is added ([crypto-js](https://github.com/brix/crypto-js))
- [x] [A2HS](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready),
[using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
Vue-CLI template took care of this

[tallys]: https://github.com/tallys/
[Color Theory]: https://tallys.github.io/color-theory/
[Audi's UI guidelines]: https://www.audi.com/ci/en/guides/user-interface/components/buttons.html
