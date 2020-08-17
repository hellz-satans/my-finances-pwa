import moment from 'moment'

// DATE FILTERS
function ago (date) {
	return moment(date).fromNow()
}

function utcToLocal (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment.utc(date).local().format(format)
}

function localToUTC (date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).utc().format(format)
}

function format (date, format = 'YYYY-MM-DD HH:mm:ss') {
	return moment(date).format(format)
}

// NUMBER FILTERS
function currency (value) {
    let val = (value/1).toFixed(2).replace(',', '.')
    return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function stringKeyFilter (value) {
  let str = "",
    c = null,
    i = 0;

  value = value.toLowerCase();
  for (i = 0; i < str.length; ++i) {
    c = str.charAt(i);
    if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
      str += c;
    }
  }

  return str;
}

export default {
	ago: ago,
	utcToLocal: utcToLocal,
	localToUTC: localToUTC,
	format: format,
	currency: currency
}
