import { unaccent } from '@/services/strings'

/**
 * Custom `JSON.stringify` replacer
 *
 * + Remove accented characters and `ñ`
 *
 * @param key {object}
 * @param value {object}
 * @return {string}
 */
function jsonDownloadReplacer(key, value) {
  if (typeof value === 'string') {
    return unaccent(value)
  }

  return value
}

/**
 * Download data with the specified data using browser mechanisms.
 *
 * @param name String
 * @param data Object
 * @return void
 */
function downloadJsonUsingBrowser (name, data) {
	const a = document.createElement('a')
	const blob = new Blob(
    [ JSON.stringify(data, jsonDownloadReplacer) ],
    { type: 'application/octet-stream' }
  )
	let uri = null

	uri = window.URL.createObjectURL(blob)

	a.setAttribute('href', uri)
	a.setAttribute('download', name)
	a.setAttribute('target', name)
	a.style.visibility = 'hidden'
	document.body.appendChild(a)
	a.click()
	window.setTimeout((ev) => {
		document.body.removeChild(a)
		window.URL.revokeObjectURL(uri)
	}, 500)
}

export {
	downloadJsonUsingBrowser
}
