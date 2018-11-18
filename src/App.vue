<template>
  <section id="app">
    <nav id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/accounts">Accounts</router-link> |
      <router-link to="/expenses">Expenses</router-link>
    </nav>
    <router-view/>
  </section>
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
