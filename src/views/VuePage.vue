<template>
  <div class="vue-page">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'vuepage',
  components: {
    HelloWorld
  }
}
</script>

<style lang="scss">
	.vue-page {
		text-align: center;
	}
</style>
