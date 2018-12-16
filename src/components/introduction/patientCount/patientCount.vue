<template>
  <div class="patientCount">
    <div class="title">
      <p>医院患者数量周统计表</p>
    </div>

    <div class="tableCount">
      <el-table :data="table1" height="327" show-summary :summary-method="getSummaries" border style="width:330px">
        <el-table-column label="星期一">
          <el-table-column prop="department"  :summary-method="getSummaries"label="科室" width="120"></el-table-column>
          <el-table-column prop="date" label="就诊日期" width="120"></el-table-column>
          <el-table-column prop="number" label="就诊人数" width="120"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="tableCount">
      <el-table :data="table2" height="327" show-summary :summary-method="getSummaries" border style="width:330px">
        <el-table-column label="星期二">
          <el-table-column prop="department" label="科室" width="120"></el-table-column>
          <el-table-column prop="date" label="就诊日期" width="120"></el-table-column>
          <el-table-column prop="number" label="就诊人数" width="120"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="tableCount">
      <el-table :data="table3" height="327" show-summary :summary-method="getSummaries" border style="width:330px">
        <el-table-column label="星期三">
          <el-table-column prop="department" label="科室" width="120"></el-table-column>
          <el-table-column prop="date" label="就诊日期" width="120"></el-table-column>
          <el-table-column prop="number" label="就诊人数" width="120"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="tableCount">
      <el-table :data="table4" height="327" show-summary :summary-method="getSummaries" border style="width:330px">
        <el-table-column label="星期四">
          <el-table-column prop="department" label="科室" width="120"></el-table-column>
          <el-table-column prop="date" label="就诊日期" width="120"></el-table-column>
          <el-table-column prop="number" label="就诊人数" width="120"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="tableCount">
      <el-table :data="table5" height="327" show-summary :summary-method="getSummaries" border style="width:330px">
        <el-table-column label="星期五">
          <el-table-column prop="department" label="科室" width="120"></el-table-column>
          <el-table-column prop="date" label="就诊日期" width="120"></el-table-column>
          <el-table-column prop="number" label="就诊人数" width="120"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="tableCount">
      <el-table :data="table6" height="327" show-summary :summary-method="getSummaries" border style="width:330px">
        <el-table-column label="星期六">
          <el-table-column prop="department" label="科室" width="120"></el-table-column>
          <el-table-column prop="date" label="就诊日期" width="120"></el-table-column>
          <el-table-column prop="number" label="就诊人数" width="120"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="tableCount">
      <el-table :data="table7" height="327" show-summary :summary-method="getSummaries" border style="width:330px">
        <el-table-column label="星期日">
          <el-table-column prop="department" label="科室" width="120"></el-table-column>
          <el-table-column prop="date" label="就诊日期" width="120"></el-table-column>
          <el-table-column prop="number" label="就诊人数" width="120"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
   <!--  <div class="button">
      <el-button type="primary" size="big" @click="amount">查看总人数</el-button>
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import {api} from '../../../global/api.js';
  export default {
    data () {
      return {
        table1: [],
        table2: [],
        table3: [],
        table4: [],
        table5: [],
        table6: [],
        table7: [],
        personSum: []
      };
    },
    methods: {
      getSummaries (param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.personSum = sums[index];
            sums[index] += ' 人';
          } else {
            sums[index] = '';
          }
        });
        return sums;
      }
    },
    created () {
      this.$axios.get(api.patientCount).then(response => {
        this.table1 = response.data.table1;
        this.table2 = response.data.table2;
        this.table3 = response.data.table3;
        this.table4 = response.data.table4;
        this.table5 = response.data.table5;
        this.table6 = response.data.table6;
        this.table7 = response.data.table7;
      }).catch(error => {
        console.error(error);
      });
    }
  };
</script>

<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .patientCount
    height:1100px
  .patientCount .title
    p
      font-size:24px
      text-align:center
      margin-bottom:20px
  .patientCount .tableCount
    float:left
    padding-bottom:20px
    padding-left:80px
</style>
