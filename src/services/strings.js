const ACCENTS = {
  'Á': 'A', 'á': 'a',
  'É': 'E', 'é': 'e',
  'Í': 'I', 'í': 'i',
  'Ó': 'O', 'ó': 'o',
  'Ú': 'U', 'ú': 'u',
  'Ä': 'A', 'ä': 'a',
  'Ë': 'E', 'ë': 'e',
  'Ï': 'I', 'ï': 'i',
  'Ö': 'O', 'ö': 'o',
  'Ü': 'U', 'ü': 'u',
  'Ñ': 'N', 'ñ': 'n',
}

const UNACCENT_REGEXES = []

/**
 * Compile all regular expressions only once for better performance
 *
 * @see UNACCENT_REGEXES
 * @return {array<array>} Push [ re, val ] to UNACCENT_REGEXES
 */
for (let k in ACCENTS) {
  UNACCENT_REGEXES.push([ new RegExp(k, 'g'), ACCENTS[k] ])
}

/**
 * Unaccent string with the predefined characters table.
 *
 * @see ACCENTS
 */
function unaccent(str) {
  let re = null,
    i = null,
    newStr = new String(str)

  for (i in UNACCENT_REGEXES) {
    newStr = newStr.replace(UNACCENT_REGEXES[i][0], UNACCENT_REGEXES[i][1])
  }

  return newStr
}

const StringsService = {
  ACCENTS,
  UNACCENT_REGEXES,
  unaccent,
}

export default StringsService

export {
  ACCENTS,
  UNACCENT_REGEXES,
  unaccent,
}
