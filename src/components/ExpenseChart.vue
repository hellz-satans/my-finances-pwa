<script>
  import { Line } from 'vue-chartjs'

  export default {
    extends: Line,
    mixins: [ VueChartJs.mixins.reactiveProp ],
    mounted() {
      this.renderChart(this.chartData, this.options);
    }
  }
</script>
