<script>
    export default {
        extends: VueChartJs.Line,
        mixins: [ VueChartJs.mixins.reactiveProp ],
        mounted() {
            this.renderChart(this.chartData, this.options);
        }
    }
</script>
