<template>
  <svg ref="svg" class="xy-chart">
  </svg>
</template>

<script>
import chartXkcd from "chart.xkcd";
import moment from "moment";
import { mapState } from "vuex";

const PERIODICITY = "week";

export default {
  name: "XYChart",

  props: {
    //expenses:    { type: Array, required: true, },
    cumulative: { type: Boolean, default: false, },
    options: { type: Object, default: () => {
      return {
        timeFormat: "DD/MM/YYYY",
        showLine:   true,
      };
    }},
    title:   { type: String, default: "", },
    xLabel:  { type: String, default: "", },
    yLabel:  { type: String, default: "", },
  },

  computed: {
    ... mapState("expenses", [ "expenses", ]),

    data() {
      let p = 0,
        prev = { income: 0, outcome: 0 },
        k = null,
        periodIncome  = {},
        periodOutcome = {};
      const income  = { label: "Income",  data: [] };
      const outcome = { label: "Outcome", data: [] };
      const periods = [];

      this.expenses.forEach((exp, i) => {
        p = Math.abs(exp.price);
        k = moment(exp.date).endOf(PERIODICITY).format("YYYY-MM-DD");

        if (periods.indexOf(k) === -1) periods.push(k);
        if (!periodIncome[k])  periodIncome[k]  = 0;
        if (!periodOutcome[k]) periodOutcome[k] = 0;

        if (exp.price < 0)
          periodOutcome[k] += p;
        else
          periodIncome[k]  += p;
      });

      periods.sort();
      prev = { income: 0, outcome: 0 };
      for (k of periods) {
        income.data.push( { x: k, y: (periodIncome[k]  + prev.income) });
        outcome.data.push({ x: k, y: (periodOutcome[k] + prev.outcome) });

        if (this.cumulative) {
          prev.income  += periodIncome[k];
          prev.outcome += periodOutcome[k];
        }
      }

      return {
        // NOTE: order determines the color
        datasets: [
          outcome,
          income,
        ],
      };
    },
  },

  data() {
    return {
      chart: null,
    };
  },

  mounted() {
    this.chart = new chartXkcd.XY(this.$refs.svg, {
      data:    this.data,
      options: this.options,
      title:   this.title,
      xLabel:  this.xLabel,
      yLabel:  this.yLabel,
    });
  },
}
</script>
