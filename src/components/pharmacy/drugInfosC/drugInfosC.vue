<template>
  <div class="drugInfosC">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-input placeholder="药品名" v-model="searchValue"></el-input>
      <el-button type="primary" icon="search" @click="search()">搜索</el-button>

      <el-button type="primary" icon="document" @click="handleDownload">导出</el-button>
      <el-button type="primary" icon="view" @click="showAll">显示全部</el-button>
    </div>
    <!-- 药物信息列表 -->
    <el-table :data="tableData" border style="width: 100%; text-align:left">
      <el-table-column prop="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="type" label="类别" width="80"></el-table-column>
      <el-table-column prop="drugname" label="药品名称" width="170"></el-table-column>
      <el-table-column prop="OTC" label="OTC标志" width="80"></el-table-column>
      <el-table-column prop="specification" label="规格" width="130"></el-table-column>
      <el-table-column prop="form" label="剂型" width="100"></el-table-column>
      <el-table-column prop="expiry_date" label="有效期至" width="130"></el-table-column>
      <el-table-column prop="vender" label="厂家" width="238"></el-table-column>
      <el-table-column prop="quantity" label="库存（件/克）" width="110"></el-table-column>
      <el-table-column prop="price" label="单价（元）" width="110"></el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button type="primary" @click="checkDetail(scope.$index)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击查看药物详细信息 -->
    <el-dialog title="产品参数" :visible.sync="dialogVisible" :before-close="handleClose">
      <ul class="drugdetail">
        <li><h5>产品名称：</h5><span>{{drugdetails.productname}}</span></li>
        <li><h5>产品剂型:</h5><span>{{drugdetails.form}}</span></li>
        <li><h5>使用剂量:</h5><span>{{drugdetails.use_quantity}}</span></li>
        <li><h5>品牌:</h5><span>{{drugdetails.brand}}</span></li>
        <li><h5>套餐类型:</h5><span>{{drugdetails.plantype}}</span></li>
        <li><h5>有效期:</h5><span>{{drugdetails.expiry}}</span></li>
        <li><h5>用法:</h5><span>{{drugdetails.usage}}</span></li>
        <li><h5>药品分类:</h5><span>{{drugdetails.OTC}}</span></li>
        <li><h5>药品名称:</h5><span>{{drugdetails.drugname}}</span></li>
        <li><h5>药品通用名:</h5><span>{{drugdetails.genericname}}</span></li>
        <li><h5>批准文号:</h5><span>{{drugdetails.certificate}}</span></li>
        <li><h5>生产企业:</h5><span>{{drugdetails.vender}}</span></li>
        <li><h5>规格: </h5><span>{{drugdetails.specification}}</span></li>
        <li><h5>类别: </h5><span>{{drugdetails.type}}</span></li>
      </ul>
      <h5 slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </h5>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import {api} from '../../../global/api.js';
  export default {
    data () {
      return {
        tableData: [],
        assistanttableData: [],
        dialogVisible: false,
        drugdetails: '',
        searchValue: ''
      };
    },
    mounted () {
      this.$axios.get(api.drugs).then(response => {
        this.tableData = response.data.tableDataC;
        this.assistanttableData = response.data.tableDataC;
      }).catch(error => {
        console.error(error);
      });
    },
    methods: {
      handleClose (done) {
        this.$confirm('确认关闭？').then(_ => {
          done();
        }).catch(_ => {});
      },
      checkDetail (index) {
        this.dialogVisible = true;
        this.drugdetails = this.tableData[index];
      },
      // 搜索
      search () {
        this.$axios.get(api.drugs, {params: {drugname: this.searchValue}}).then((response) => {
          this.tableData = [];
          for (let i = 0; i < response.data.tableDataC.length; i++) {
            if (response.data.tableDataC[i].drugname === this.searchValue) {
              this.tableData.push(response.data.tableDataC[i]);
            }
          };
        }).catch(error => {
          console.error(error);
        });
      },
      // 显示全部数据
      showAll () {
        this.tableData = this.assistanttableData;
        this.searchValue = '';
      },
      // 把数据表格导出到excel表
      handleDownload () {
        var vm = this;

        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel');
          const tHeader = ['序号', '类别', '药品名称', 'OTC标志', '规格', '剂型', '厂家', '库存（件）', '单价（元）'];
          const filterVal = ['index', 'type', 'drugname', 'OTC', 'specification', 'form', 'vender', 'quantity', 'price'];
          const tableData = vm.tableData;
          const data = vm.formatJson(filterVal, tableData);
          export_json_to_excel(tHeader, data, '药房药物信息列表excel');
        });
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      }
    }
};
</script>

<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .drugInfosC .filter-container
    padding-bottom:30px
    .el-input
      width: 400px
  .drugInfosC .el-table-column
    font-weight: bold
  .drugInfosC .drugdetail
    h5
      display: inline-block
      width: 100px
      line-height: 30px
      font-weight: bold
</style>
