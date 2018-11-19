<template>
  <sui-container>
    <sui-menu pointing secondary>
      <router-link to="/" is="sui-menu-item" exact>Home</router-link>
      <router-link to="/about" is="sui-menu-item">About</router-link>
      <router-link to="/accounts" is="sui-menu-item">Accounts</router-link>
      <router-link to="/expenses" is="sui-menu-item">Expenses</router-link>
      <router-link to="/vue" is="sui-menu-item">Vue Docs</router-link>
    </sui-menu>

    <router-view/>
  </sui-container>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
	width: 90%;
	margin: 1rem auto;
}
#nav {
  padding: 30px;
	text-align: center;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
