<template>
  <div id="app">
    <v-chart class="my-chart" :options="bar"/>
  </div>
</template>
<script>
  let echarts = require('vue-echarts');
  require('echarts/lib/chart/bar');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  export default {
    components: {
      'v-chart': echarts
    },
    data () {
      return {
        bar: {
          title: {
            text: '本周患者就诊数量统计',
            subtext: '各个部门数据',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['内科', '外科', '妇产科', '男科', '儿科', '五官科', '骨科', '精神科', '护士科', '胸心外科', '口腔科']
          },
          series: []
        }
      };
    },
    mounted () {
      this.$axios.get('http://localhost:8081/register/getRegisterGroupByDepartment').then(response => {
        this.bar.series = [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: response.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ];
      }).catch(error => {
        console.error(error);
      });
    }
  };
</script>
<style>
  .my-chart {
    width: 800px;
    height: 500px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
