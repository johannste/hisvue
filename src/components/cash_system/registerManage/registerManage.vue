<template>
  <div class="registerManage">
    <div class="filter-container">
      <!--TODO 先不做-->
      <!--<el-input placeholder="处方编号" v-model="searchNumber"></el-input>-->
      <el-input placeholder="患者姓名" v-model="searchName"></el-input>
      <el-button type="primary" icon="search" @click="searchPatient">搜索</el-button>
      <el-button type="primary" icon="view" @click="showAll">显示全部</el-button>
      <el-button type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>
    <el-table :data="patients" class="register-table">
      <el-table-column sortable width="100px" prop="序号" label="序号"></el-table-column>
      <el-table-column width="100px" prop="患者姓名" label="患者姓名"></el-table-column>
      <el-table-column width="100px" prop="科室" label="科室"></el-table-column>
      <el-table-column sortable width="127px" prop="就诊日期" label="就诊日期"></el-table-column>
      <el-table-column sortable width="127px" prop="就诊时间" label="就诊时间"></el-table-column>
      <el-table-column sortable width="215px" prop="候诊号" label="候诊号"></el-table-column>
      <el-table-column width="100px" prop="挂号费" label="挂号费"></el-table-column>
      <el-table-column width="250px" label="操作">
        <template slot-scope="scope">
          <el-button size="small" class="btn" @click="checkDetail(scope.$index, scope.row)">查看</el-button>
          <el-button size="small" v-if="patients[scope.$index].缴费状态==='未缴费'" type="primary" class="btn" @click="updatePay(scope.$index, scope.row)">缴费</el-button>
          <el-button size="small" v-if="patients[scope.$index].挂号状态!=='有效'" type="danger" class="btn" @click="deleteDetail(scope.$index, patients)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="患者挂号信息" :visible.sync="dialogVisible">
      <ul class="patients-detail">
        <li><h5>序号：</h5><span>{{patientsDetails.序号}}</span></li>
        <li><h5>患者姓名:</h5><span>{{patientsDetails.患者姓名}}</span></li>
        <li><h5>挂号凭证:</h5><span>{{patientsDetails.挂号凭证}}</span></li>
        <li><h5>科室:</h5><span>{{patientsDetails.科室}}</span></li>
        <li><h5>就诊医生:</h5><span>{{patientsDetails.就诊医生}}</span></li>
        <li><h5>就诊日期:</h5><span>{{patientsDetails.就诊日期}}</span></li>
        <li><h5>就诊时间:</h5><span>{{patientsDetails.就诊时间}}</span></li>
        <li><h5>候诊号:</h5><span>{{patientsDetails.候诊号}}</span></li>
        <li><h5>挂号费:</h5><span>{{patientsDetails.挂号费}}</span></li>
        <li><h5>缴费状态:</h5><span>{{patientsDetails.缴费状态}}</span></li>
        <li><h5>挂号状态:</h5><span>{{patientsDetails.挂号状态}}</span></li>
      </ul>
    </el-dialog>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="queryRegisterListByPage" :current-page.sync="currentPage" :page-sizes="[3, 10, 15, 20]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="totalCount">
      </el-pagination>
    </div>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        patients: [],
        intendedPatients: [],
        dialogVisible: false,
        patientsDetails: '',
        patientsExportDetails: '',
        searchName: '',
        currentPage: 1,
        totalCount: 0,
        pageSize: 3
      };
    },
    mounted () {
      this.showAll();
    },
    methods: {
      queryRegisterListByPage () {
        this.$axios.get('http://localhost:8081/patient/queryRegisterListByPage?begin=' + (this.currentPage - 1) * this.pageSize + '&end=' + this.currentPage * this.pageSize).then(response => {
          this.patients = response.data;
        }).catch(error => {
          console.error(error);
        });
      },
      handleSizeChange (val) {
        this.pageSize = val;
        this.queryRegisterListByPage();
      },
      searchPatient () {
        this.patients = [];
        for (let i = 0; i < this.intendedPatients.length; i++) {
          if (this.intendedPatients[i].患者姓名 === this.searchName) {
            this.patients.push(this.intendedPatients[i]);
          }
        }
        // TODO 子页面搜索
        this.patientsExportDetails = this.patients;
      },
      showAll () {
        this.$axios.get('http://localhost:8081/patient/queryRegisterList').then(response => {
          this.intendedPatients = response.data;
          this.patientsExportDetails = this.intendedPatients;
          this.totalCount = response.data.length;
        }).catch(error => {
          console.error(error);
        });
        this.$axios.get('http://localhost:8081/patient/queryRegisterListByPage?begin=' + (this.currentPage - 1) * this.pageSize + '&end=' + this.currentPage * this.pageSize).then(response => {
          this.patients = response.data;
        }).catch(error => {
          console.error(error);
        });
      },
      handleClose (done) {
        this.$confirm('确认关闭？').then(_ => {
          done();
        }).catch(_ => {});
      },
      checkDetail (index, row) {
        this.dialogVisible = true;
        this.patientsDetails = row;
      },
      updatePay (index, rows) {
        this.$axios.get('http://localhost:8081/patient/updateRegisterPayment?id=' + rows.序号).then(response => {
          if (response.data === true) {
            this.$message.success('缴费成功');
            this.intendedPatients[index].缴费状态 = '已缴费';
            this.intendedPatients[index].挂号状态 = '有效';
          }
        }).catch(error => {
          console.error(error);
          this.$message.error('缴费失败');
        });
      },
      deleteDetail (index, rows) {
        this.$axios.get('http://localhost:8081/patient/cancelRegisterStatus?id=' + rows[index].序号).then(response => {
          if (response.data === true) {
            this.$message.success('取消成功');
          }
          rows.splice(index, 1);
        }).catch(error => {
          console.error(error);
          this.$notify.error('取消失败');
        });
      },
      handleDownload () {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel');
          const tHeader = ['序号', '患者姓名', '挂号凭证', '科室', '就诊医生', '就诊日期', '就诊时间', '候诊号', '挂号费', '挂号状态', '缴费状态'];
          const filterVal = ['序号', '患者姓名', '挂号凭证', '就诊医生', '就诊日期', '就诊时间', 'date', '候诊号', '挂号费', '挂号状态', '缴费状态'];
          const data = this.formatJson(filterVal, this.patientsExportDetails);
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
  .filter-container
      padding-bottom: 30px

  .register-table
    width: 1120px
    margin-left: auto
    margin-right: auto

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

  .block
    margin-top: 28px
    margin-left: 1.5%
</style>
