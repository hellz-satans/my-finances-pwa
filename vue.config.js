module.exports = {
  outputDir: 'dist/my-finances-pwa',
  publicPath: '',

  productionSourceMap: false,

  pwa: {
    name: "MyFin",
    short_name: "MyFin",
    start_url: "index.html",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#0c141f",
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon-152x152.png",
      maskIcon: "img/icons/safari-pinned-tab.svg",
      msTileImage: "img/icons/msapplication-icon-144x144.png",
    },
  },

  devServer: {
    port: 8000,
  },
}
