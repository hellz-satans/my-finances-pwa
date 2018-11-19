import Vue from 'vue'

// DATE FILTERS
Vue.filter('ago', function (date) {
    return moment(date).fromNow()
})

Vue.filter('utc_to_local', function (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment.utc(date).local().format(format)
})

Vue.filter('local_to_utc', function (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).utc().format(format)
})

Vue.filter('format', function (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(format)
})