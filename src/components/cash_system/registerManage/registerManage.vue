<template>
  <div class="registerManage">
    <div class="filter-container">
      <!--TODO 先不做-->
      <!--<el-input placeholder="处方编号" v-model="searchNumber"></el-input>-->
      <el-input placeholder="患者姓名" v-model="searchName"></el-input>
      <el-button type="primary" icon="search" @click="search">搜索</el-button>
      <el-button type="primary" icon="view" @click="showAll">显示全部</el-button>
      <el-button type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>
    <el-table :data="patients" style="width: 95%; margin-left: 2%">
      <el-table-column width="100px" prop="序号" label="序号"></el-table-column>
      <el-table-column width="100px" prop="患者姓名" label="患者姓名"></el-table-column>
      <el-table-column width="100px" prop="科室" label="科室"></el-table-column>
      <el-table-column width="120px" prop="就诊日期" label="就诊日期"></el-table-column>
      <el-table-column width="120px" prop="就诊时间" label="就诊时间"></el-table-column>
      <el-table-column width="215px" prop="候诊号" label="候诊号"></el-table-column>
      <el-table-column width="100px" prop="挂号费" label="挂号费"></el-table-column>
      <el-table-column width="250px" label="操作">
        <template slot-scope="scope">
          <el-button class="btn" @click="checkDetail(scope.$index)">查看</el-button>
          <el-button v-if="patients[scope.$index].缴费状态==='未缴费'" type="primary" class="btn" @click="updatePay(scope.$index, patients)">缴费</el-button>
          <el-button v-if="patients[scope.$index].挂号状态!=='有效'" type="danger" class="btn" @click="deleteDetail(scope.$index, patients)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="患者挂号信息" :visible.sync="dialogVisible">
      <ul class="patients-detail">
        <li><h5>序号：</h5><span>{{patientsdetails.序号}}</span></li>
        <li><h5>患者姓名:</h5><span>{{patientsdetails.患者姓名}}</span></li>
        <li><h5>挂号凭证:</h5><span>{{patientsdetails.挂号凭证}}</span></li>
        <li><h5>科室:</h5><span>{{patientsdetails.科室}}</span></li>
        <li><h5>就诊医生:</h5><span>{{patientsdetails.就诊医生}}</span></li>
        <li><h5>就诊日期:</h5><span>{{patientsdetails.就诊日期}}</span></li>
        <li><h5>就诊时间:</h5><span>{{patientsdetails.就诊时间}}</span></li>
        <li><h5>候诊号:</h5><span>{{patientsdetails.候诊号}}</span></li>
        <li><h5>挂号费:</h5><span>{{patientsdetails.挂号费}}</span></li>
        <li><h5>缴费状态:</h5><span>{{patientsdetails.缴费状态}}</span></li>
        <li><h5>挂号状态:</h5><span>{{patientsdetails.挂号状态}}</span></li>
      </ul>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        patients: [],
        intendedpatients: [],
        dialogVisible: false,
        patientsdetails: '',
        searchNumber: '',
        searchName: ''
      };
    },
    mounted () {
      this.$axios.get('http://localhost:8081/patient/queryRegisterList').then(response => {
        this.intendedpatients = response.data;
        this.patients = this.intendedpatients;
      }).catch(error => {
        console.error(error);
      });
    },
    methods: {
      search () {
        this.patients = [];
        for (let i = 0; i < this.intendedpatients.length; i++) {
          if (this.searchNumber && this.searchName) {
            if (this.intendedpatients[i].number === this.searchNumber && this.intendedpatients[i].患者姓名 === this.searchName) {
              this.patients.push(this.intendedpatients[i]);
            }
          } else {
            if (this.searchNumber && this.intendedpatients[i].number === this.searchNumber) {
              this.patients.push(this.intendedpatients[i]);
            } else if (this.searchName && this.intendedpatients[i].患者姓名 === this.searchName) {
              this.patients.push(this.intendedpatients[i]);
            }
          }
        }
      },
      showAll () {
        this.patients = this.intendedpatients;
        this.searchNumber = '';
        this.searchNamer = '';
      },
      handleClose (done) {
        this.$confirm('确认关闭？').then(_ => {
          done();
        }).catch(_ => {});
      },
      checkDetail (index) {
        this.dialogVisible = true;
        this.patientsdetails = this.patients[index];
      },
      updatePay (index, rows) {
        this.$axios.get('http://localhost:8081/patient/updateRegisterPayment?id=' + rows[index].序号).then(response => {
          this.$message.success({
            message: '缴费成功'
          });
          this.intendedpatients[index].缴费状态 = '已缴费';
          this.intendedpatients[index].挂号状态 = '有效';
        }).catch(error => {
          console.error(error);
          this.$message.error({
            message: '缴费失败'
          });
        });
      },
      deleteDetail (index, rows) {
        this.$axios.get('http://localhost:8081/patient/cancelRegisterStatus?id=' + rows[index].序号).then(response => {
          this.$message.success({
            message: '取消成功'
          });
          rows.splice(index, 1);
        }).catch(error => {
          console.error(error);
          this.$notify.error({
            message: '取消失败'
          });
        });
      },
      handleDownload () {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel');
          const tHeader = ['序号', '患者姓名', '挂号凭证', '科室', '就诊医生', '就诊日期', '就诊时间', '候诊号', '挂号费', '挂号状态', '缴费状态'];
          const filterVal = ['序号', '患者姓名', '挂号凭证', '就诊医生', '就诊日期', '就诊时间', 'date', '候诊号', '挂号费', '挂号状态', '缴费状态'];
          const patients = this.patients;
          const data = this.formatJson(filterVal, patients);
          export_json_to_excel(tHeader, data, '患者挂号信息列表excel');
        });
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      }
    }
};
</script>

<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .registerManage .filter-container
      padding-bottom: 30px

  .el-input
      width: 200px
      margin: 0 5% 0 2%

    .patients-detail
      h5
        display: inline-block
        width: 100px
        line-height: 30px
        font-weight: bold

    .btn
        display: inline-block

</style>
