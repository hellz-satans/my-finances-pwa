<template>
  <div class="money-input">
    <span
      :class="{ 'sign': true, positive: sign > 0, negative: sign < 0 }"
      @click="emitSign"
    >{{ (sign > 0) ? '+' : '-' }}</span>

    <money
      v-bind="moneyConf"
      @input="emitValue($event)"
      :value="money"
    ></money>
  </div>
</template>

<script>
import { Money } from 'v-money'

export default {
  components: {
    Money,
  },

  props: {
    value: { type: Number, required: true, default: 0, },
  },

  data() {
    return {
      moneyConf: {
        prefix: '$',
        precision: 2,
        masked: false,
      },
      money: 0, // for internal handling
      sign: -1,
    }
  },

  methods: {
    emitValue(val) {
      //console.debug('emitValue:', typeof val, val);
      if (val != 0) {
        this.$emit('input', val * this.sign);
        this.money = val;
      } else {
        this.$emit('input', 0);
      }
    },

    emitSign() {
      //console.debug('emitSign:', this.sign, '=>', this.sign * -1);
      this.sign = this.sign * -1;
      this.emitValue(this.money);
    },
  },

  created() {
    //console.debug('MoneyInput: created', this.value, Math.abs(this.value));
    this.money = Math.abs(this.value);
    this.sign  = (this.value > 0) ? 1 : -1;
  }
}
</script>

<style lang="scss">
.money-input {
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;

  .sign {
    margin-right: 0.25em;
    cursor: pointer;
    font-size: 2rem;
    font-weight: 600;

    &.positive { color: green; }
    &.negative { color: red; left: 1.75rem; }
  }
}
</style>
