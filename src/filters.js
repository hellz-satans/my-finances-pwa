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

// NUMBER FILTERS
Vue.filter('currency', function (value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})
