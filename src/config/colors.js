/**
 * Generate list of HSL colors.
 *
 * @param  [Number] step Increase step going from 0 to 360 exclusive
 * @param  [String] saturation Saturation percentage
 * @param  [String] lightness Lightness percentage
 * @return [Array] List of string representation of HSL colors
 */
function hslColors(step = 20, saturation = "100%", lightness = "50%") {
  const colors = [];
  let i = 0;

  for (i = 0; i < 360; i += step) {
    colors.push(`hsl(${i}, ${saturation}, ${lightness})`);
  }

  return colors;
}

const darkMaterialColors = [
  '#D32F2F',
  '#C2185B',
  '#7B1FA2',
  '#512DA8',
  '#303F9F',
  '#1976D2',
  '#0288D1',
  '#0097A7',
  '#00796B',
  '#388E3C',
  '#689F38',
  '#AFB42B',
  '#FBC02D',
  '#FFA000',
  '#F57C00',
  '#E64A19',
  '#5D4037',
  '#616161',
  '#455A64',
];

const colors = hslColors(20, "100%", "35%");

module.exports = colors;

module.exports.colors    = colors;
module.exports.primary   = colors[15];
module.exports.secondary = colors[5];
