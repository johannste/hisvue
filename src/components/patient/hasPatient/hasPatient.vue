<template>
  <div class="hasPatient">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="搜索关键字" style="width:150px;"></el-input>
      <el-select v-model="listQuery.select" placeholder="搜索类型" style="width:150px;">
        <el-option label="姓名" value="1"></el-option>
        <el-option label="主治医生" value="2"></el-option>
        <el-option label="日期" value="3"></el-option>
      </el-select>
      <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" icon="view" @click="showAll">显示全部</el-button>
      <el-button type="primary" icon="delete" @click="handleDelAll">批量删除</el-button>
      <el-button type="primary" @click="handleDownload"><i class="el-icon-document el-icon--left"></i>导出</el-button>
    </div><br><br>
    <el-table :data="patients" style="width:100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column sortable label='序号' prop="序号"></el-table-column>
      <el-table-column label="姓名" prop="姓名"></el-table-column>
      <el-table-column label="性别" prop="性别"></el-table-column>
      <el-table-column label="年龄" prop="年龄"></el-table-column>
      <el-table-column sortable label="注册时间" prop="注册时间" :formatter="formatterController"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="姓名">
              <span>{{ props.row.姓名 }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.性别 }}</span>
            </el-form-item>
            <el-form-item label="年龄">
              <span>{{ props.row.年龄 }}</span>
            </el-form-item>
            <el-form-item label="省份">
              <span>{{ props.row.省份 }}</span>
            </el-form-item>
            <el-form-item label="城市">
              <span>{{ props.row.城市 }}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{ props.row.详细地址 }}</span>
            </el-form-item>
            <el-form-item label="挂号凭证">
              <span>{{ props.row.挂号凭证 }}</span>
            </el-form-item>
            <el-form-item label="凭证号">
              <span>{{ props.row.凭证号 }}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{ props.row.手机 }}</span>
            </el-form-item>
            <el-form-item label="联系人姓名">
              <span>{{ props.row.联系人姓名 }}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{ props.row.联系方式 }}</span>
            </el-form-item>
            <el-form-item label="与患者关系">
              <span>{{ props.row.与患者关系 }}</span>
            </el-form-item>
            <el-form-item label="身体状况">
              <span>{{ props.row.身体状况 }}</span>
            </el-form-item>
            <el-form-item label="病史">
              <span>{{ props.row.病史 }}</span>
            </el-form-item>
            <el-form-item label="患者来源">
              <span>{{ props.row.患者来源 }}</span>
            </el-form-item>
            <el-form-item label="注册时间">
              <span>{{ formatterController('', props.row.注册时间) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button class="btn" size="small" type="primary" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
          <el-button class="btn" size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
     </el-table-column>
    </el-table>
      <el-dialog title="编辑表单" :data="patients" :visible.sync="dialogFormEditVisible">
        <el-form class="small-space" :model="patientsDetails" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
          <el-form-item label="省份">
            <el-input v-model="patientsDetails.province"></el-input>
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="patientsDetails.city"></el-input>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="patientsDetails.moreAddress"></el-input>
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="patientsDetails.phone"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名">
            <el-input v-model="patientsDetails.relatedName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="patientsDetails.relatedPhoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="与患者关系">
            <el-input v-model="patientsDetails.relationship"></el-input>
          </el-form-item>
          <el-form-item label="身体状况">
            <el-input v-model="patientsDetails.symptoms"></el-input>
          </el-form-item>
          <el-form-item label="病史">
            <el-input v-model="patientsDetails.illHistory"></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn" @click="dialogFormEditVisible = false">取 消</el-button>
        <el-button class="btn" type="primary" @click="handleEditSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data () {
    return {
      patients: [],
      listQuery: {
        select: '',
        title: ''
      },
      temp: {
        date: '',
        name: '',
        sex: '',
        age: '',
        doctor: ''
      },
      patientsDetails: {
        province: '',
        city: '',
        moreAddress: '',
        phone: '',
        relatedName: '',
        relatedPhoneNumber: '',
        relationship: '',
        symptoms: '',
        illHistory: '',
        region: ''
      },
      dialogFormEditVisible: false,
      dialogFormVisible: false,
      multipleSelection: [],
      intendedPatients: []
    };
  },
  created () {
    this.$axios.get('http://localhost:8081/patient/queryAllPatient').then(response => {
      this.intendedPatients = response.data;
      this.patients = this.intendedPatients;
    }).catch(error => {
      console.error(error);
    });
  },
  methods: {
    formatterController: (row, column) => {
      let moment = require('moment');
      let date;
      if (row !== '' && typeof (row[column.property]) !== 'undefined') {
        date = row[column.property];
      } else {
        date = column;
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    showAll () {
      this.patients = this.intendedPatients;
      this.listQuery.title = '';
      this.listQuery.select = '';
    },
    handleSearch () {
      if (this.listQuery.title && this.listQuery.select) {
        this.patients = [];
        for (let i = 0; i < this.intendedPatients.length; i++) {
          if (this.listQuery.select === '1') {
            if (this.intendedPatients[i].姓名 === this.listQuery.title) {
              this.patients.push(this.intendedPatients[i]);
            }
          }
        }
      } else {
        this.$notify.error('请选择条件');
      }
    },
    handleEdit (index, row) {
      this.dialogFormEditVisible = true;
      this.patientsDetails.province = row.省份;
      this.patientsDetails.city = row.城市;
      this.patientsDetails.moreAddress = row.详细地址;
      this.patientsDetails.phone = row.手机;
      this.patientsDetails.relatedName = row.联系人姓名;
      this.patientsDetails.relatedPhoneNumber = row.联系方式;
      this.patientsDetails.relationship = row.与患者关系;
      this.patientsDetails.symptoms = row.身体状况;
      this.patientsDetails.illHistory = row.病史;
    },
    handleEditSubmit () {
      this.dialogFormEditVisible = false;
      this.$notify.success('修改成功');
      // TODO
      console.log(JSON.stringify(this.patientsDetails));
    },
    handleDelete (index, row) {
      console.log('单个删除选择的row：', index, '-----', row);
      this.patients.splice(index, 1);
    },
    handleCreate () {
      this.dialogFormVisible = true;
    },
    handleSelectionChange (val) {
      this.multipleSelection = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].序号);
      }
      this.$axios.get('').then(response => {
        if (response.data === 'true') {
          this.$notify.success('删除成功');
        } else {
          this.$notify.error('删除失败');
        }
      }).catch(error => {
        console.log(error);
      });
    },
    handleDownload () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel');
        const tHeader = ['日期', '名字', '性别', '地址', '联系号码', '年龄', '主治医生'];
        const filterVal = ['date', 'name', 'sex', 'address', 'phone', 'age', 'doctor'];
        const patients = this.patients;
        const data = this.formatJson(filterVal, patients);
        export_json_to_excel(tHeader, data, '导出的列表excel');
      });
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    handleDelAll () {
      console.log('批量删除选择的row：', JSON.stringify(this.multipleSelection));
    }
  }
};

</script>

<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .hasPatient
    .demo-table-expand label
      width: 90px
      color: #99a9bf

    .demo-table-expand .el-form-item
      margin-right: 0
      margin-bottom: 0
      width: 33%

  .patients-detail
    h5
      display: inline-block
      width: 100px
      line-height: 30px
      font-weight: bold
</style>
