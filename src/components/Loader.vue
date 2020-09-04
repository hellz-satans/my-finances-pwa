<template>
  <div class="loader">
    <fa class="loader-bill" :icon="[ 'fas', 'money-bill-alt' ]" />
    <fa class="loader-bill" :icon="[ 'fas', 'money-bill-alt' ]" />
    <fa class="loader-bill" :icon="[ 'fas', 'money-bill-alt' ]" />

    <fa class="loader-wallet" :icon="[ 'fas', 'wallet' ]" />
  </div>
</template>

<script>
export default {
  name: "Loader",
}
</script>

<style lang="scss">
$animation-count: 2;
$duration: 1s;
$loader-bg: #fff;

.loader {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 10;
  background-color: $loader-bg;

  &-bill {
    position: absolute;
    left: 47%;
    font-size: 2em;
    color: #333;
    opacity: 0;
    animation: fall $duration ease-in 0.3s $animation-count;

    &:nth-child(2) { animation-delay: 0.6s; }
    &:nth-child(3) { animation-delay: 0.8s; }
  }

  &-wallet {
    color: #222;

    width: 50%;
    margin: 0;
    text-align: center;
    animation: mf ($duration * 1.1) $duration $animation-count;
    position: absolute;
    top: 40%;
    left: 40%;
    font-size: 6em;
  }
}

@keyframes mf {
  00%  { transform: scale(1.0); }
  60%  { transform: scale(1.2); }
  66%  { transform: scale(1.0); }
  72%  { transform: scale(1.3); }
  80%  { transform: scale(1.0); }
}

@keyframes fall {
  0%   { opacity: 0.0;  top: 0%;  transform: rotate(0deg); }
  10%  { opacity: 0.25; }
  30%  { opacity: 1.00; }
  80%  { opacity: 0.75; }
  100% { top: 50%; transform: rotate(360deg); }
}
</style>
