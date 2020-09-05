<template>
  <svg ref="svg" class="xy-chart">
  </svg>
</template>

<script>
import chartXkcd from "chart.xkcd";
import moment from "moment";

const DEFAULT_OPTIONS = {
  timeFormat: "MMM",
  showLine:   true,
  //legendPosition: chartXkcd.config.positionType.downRight,
};

export default {
  name: "XYChart",

  props: {
    data:        { type: Object, required: true, },
    options:     { type: Object, default: () => new Object() },
    title:       { type: String, default: "", },
    xLabel:      { type: String, default: "", },
    yLabel:      { type: String, default: "", },
  },

  data() {
    return {
      chart: null,
    };
  },

  computed: {
    config() {
      return {
        data:    this.data,
        options: Object.assign(DEFAULT_OPTIONS, this.options),
        title:   this.title,
        xLabel:  this.xLabel,
        yLabel:  this.yLabel,
      };
    },
  },

  watch: {
    data() {
      this.chart = new chartXkcd.XY(this.$refs.svg, this.config);
    },
  },

  mounted() {
    this.chart = new chartXkcd.XY(this.$refs.svg, this.config);
  },
}
</script>
