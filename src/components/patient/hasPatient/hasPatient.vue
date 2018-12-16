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
      <el-button type="primary" icon="edit" @click="handleCreate">添加</el-button>
      <el-button type="primary" icon="delete" @click="handleDelAll">批量删除</el-button>
      <el-button type="primary" @click="handleDownload"><i class="el-icon-document el-icon--left"></i>导出</el-button>
    </div><br><br>
    <el-table :data="tableData" border style="width:100%;" @selection-change="handleSelectionChange">
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
    <!-- 添加表单 -->
    <el-dialog title="表单新增" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="日期">
          <el-input v-model="temp.date"></el-input>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="temp.sex"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="temp.age"></el-input>
        </el-form-item>
        <el-form-item label="主治医生">
          <el-input v-model="temp.doctor"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn" @click="dialogFormVisible = false">取 消</el-button>
        <el-button class="btn" type="primary" @click="handleCreateSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑表单 -->
    <el-dialog title="编辑表单" :data="tableData" :visible.sync="dialogFormEditVisible">
      <el-form class="small-space" :model="Edit" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="姓名">
          <el-input v-model="Edit.name"></el-input>
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="Edit.name"></el-input>
        </el-form-item>
        <el-form-item label="患者来源">
          <el-input v-model="Edit.region"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="Edit.idCard"></el-input>
        </el-form-item>
        <el-form-item label="患者年龄">
          <el-input v-model="Edit.age"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="Edit.phone"></el-input>
        </el-form-item>
        <el-form-item label="患者性别">
          <el-input v-model="Edit.sex"></el-input>
        </el-form-item>
        <el-form-item label="家庭地址">
          <el-input v-model="Edit.address"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名">
          <el-input v-model="Edit.Name"></el-input>
        </el-form-item>
        <el-form-item label="联系人号码">
          <el-input v-model="Edit.Phone"></el-input>
        </el-form-item>
        <el-form-item label="患者与联系人关系">
          <el-input v-model="Edit.relation"></el-input>
        </el-form-item>
        <el-form-item label="病症">
          <el-input v-model="Edit.symptoms"></el-input>
        </el-form-item>
        <el-form-item label="病史">
          <el-input v-model="Edit.illHistory"></el-input>
        </el-form-item>
        <el-form-item label="科室">
          <el-input v-model="Edit.disease"></el-input>
        </el-form-item>
        <el-form-item label="主治医生">
         <el-input v-model="Edit.doctor"></el-input>
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
import {api} from '../../../global/api.js';
export default {
  data () {
    return {
      tableData: [],
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
      Edit: {
        name: '',
        date: '',
        region: '',
        idCard: '',
        age: '',
        phone: '',
        sex: '',
        address: '',
        Name: '',
        Phone: '',
        relation: '',
        symptoms: '',
        illHistory: '',
        disease: '',
        doctor: ''
      },
      dialogFormEditVisible: false,
      dialogFormVisible: false,
      multipleSelection: []
    };
  },
  created () {
    this.$axios.get('http://localhost:8081/patient/queryAllPatient').then(response => {
      this.tableData = response.data;
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
    handleSearch () {
      this.$axios.get(api.patientList, {params: {name: this.listQuery.title}}).then(response => {
        this.tableData = response.data.tableData;
      }).catch(error => {
        console.error(error);
      });
    },
    handleEdit (index, row) {
      this.dialogFormEditVisible = true;
      this.Edit = row;// 浅拷贝
      // 深度拷贝
      // this.Edit = JSON.parse(JSON.stringify(row));
    },
    handleEditSubmit () {
      this.Edit;
      this.dialogFormEditVisible = false;
    },
    handleDelete (index, row) {
      console.log('单个删除选择的row：', index, '-----', row);
      this.tableData.splice(index, 1);
    },
    handleCreate () {
      this.dialogFormVisible = true;
    },
    handleCreateSubmit () {
      console.log('新增入参：', this.temp);
      this.tableData
      .push(this.temp);
      this.dialogFormVisible = false;
      this.temp = {
        date: '',
        name: '',
        sex: '',
        age: '',
        doctor: ''
      };
    },
    handleDelAll () {
      console.log('批量删除选择的row：', JSON.stringify(this.multipleSelection));
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
        const tableData = this.tableData;
        const data = this.formatJson(filterVal, tableData);
        export_json_to_excel(tHeader, data, '导出的列表excel');
      });
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};

</script>

<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .hasPatient .demo-table-expand
    font-size: 0

  .hasPatient .demo-table-expand label
    width: 90px
    color: #99a9bf

  .hasPatient .demo-table-expand .el-form-item
    margin-right: 0
    margin-bottom: 0
    width: 33%
</style>
