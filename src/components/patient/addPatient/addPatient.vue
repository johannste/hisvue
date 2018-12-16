<template>
  <div class="addPatient">
    <el-form :model="ruleForm" class="demo-ruleForm" ref="ruleForm" :rules="rules" label-width="100px">
      <h1 class="record">新建患者档案</h1><br/>
      <el-form-item label="患者姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="患者来源" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择患者来源">
          <el-option v-for="item in regions" :key="item.id" :label="item.type" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="ruleForm.idCard"></el-input>
      </el-form-item>
      <el-form-item label="患者年龄" prop="age">
        <el-input disabled v-model="ruleForm.age"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="患者性别" prop="gender">
        <el-radio-group disabled v-model="ruleForm.gender">
          <el-radio :label="0" label-width="150px">男</el-radio>
          <el-radio :label="1" label-width="150px">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="家庭地址">
        <el-select v-model="selectProvince" placeholder="选择省份">
          <el-option v-for="item in provinces" :key="item.value" :label="item.value" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="selectCity" placeholder="选择城市">
          <el-option v-for="item in citys" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
        <el-input v-model="ruleForm.moreAddress" placeholder="详细地址"></el-input>
      </el-form-item>
      <br/>
      <h3>联系人资料</h3><br/>
      <el-form-item label="联系人姓名" prop="relatedName">
        <el-input v-model="ruleForm.relatedName"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="relatedPhoneNumber">
        <el-input v-model="ruleForm.relatedPhoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="与患者关系" prop="relationship">
        <el-select v-model="ruleForm.relationship" placeholder="与患者关系">
          <el-option v-for="item in relations" :key="item.id" :label="item.type" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目前身体状况" prop="symptoms">
        <el-input type="textarea" v-model="ruleForm.symptoms"></el-input>
      </el-form-item>
      <h3>是否有病史？如果有，请简单说明</h3><br/>
      <el-form-item label="病史简单说明" prop="illHistory">
        <el-input type="textarea" v-model="ruleForm.illHistory"></el-input>
      </el-form-item>
      <el-form-item class="center">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="offReset('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
  import {api} from '../../../global/api.js';
  export default {
    data () {
      let checkPhone = (rule, value, callback) => {
        if (/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(value) === false) {
          callback(new Error('请输入正确号码'));
        } else {
          callback();
        }
      };
      let checkRelatedPhoneNumber = (rule, value, callback) => {
        if (value && /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(value) === false) {
          callback(new Error('请输入正确号码'));
        } else {
          callback();
        }
      };
      let checkIdCard = (rule, value, callback) => {
        if (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(value) === false) {
          callback(new Error('身份证号有误'));
        } else {
          var year = new Date().getFullYear();
          this.ruleForm.gender = value % 2 === 0 ? 0 : 1;
          if (value.length === 18) {
            this.ruleForm.age = year - value.substring(6, 10);
          } else if (value.length === 15) {
            this.ruleForm.age = year - ('19' + value.substring(6, 12)).substring(0, 4);
          }
          callback();
        }
      };
      let checkRegion = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择来源'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          createDate: new Date(),
          name: '',
          region: '',
          idCard: '',
          gender: '',
          age: '',
          phone: '',
          relatedName: '',
          relatedPhoneNumber: '',
          relationship: '',
          province: '',
          city: '',
          moreAddress: '',
          symptoms: '',
          illHistory: ''
        },
        regions: [],
        relations: [],
        provinces: [],
        citys: [],
        selectProvince: '',
        selectCity: '',
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now - 8.64e7;
          }
        },
        rules: {
          name: [
            {required: true, trigger: 'blur'}
          ],
          phone: [
            {required: true, validator: checkPhone, trigger: 'blur'}
          ],
          relatedPhoneNumber: [
            {validator: checkRelatedPhoneNumber, trigger: 'blur'}
          ],
          region: [
            {required: true, validator: checkRegion, trigger: 'change'}
          ],
          idCard: [
            {required: true, validator: checkIdCard, trigger: 'blur'}
          ],
          age: [
            {required: true}
          ],
          gender: [
            {required: true}
          ],
          province: [
            {required: true}
          ],
          city: [
            {required: true}
          ],
          moreAddress: [
            {required: true}
          ]
        }
      };
    },
    mounted () {
      this.$axios.get(api.provinces).then(response => {
        this.provinces = response.data.provinces;
      }).catch(error => {
        console.error(error);
      });
      this.$axios.get('http://localhost:8081/patient/queryRegion').then(response => {
        this.regions = response.data;
      }).catch(error => {
        console.error(error);
      });
      this.$axios.get('http://localhost:8081/patient/queryRelationship').then(response => {
        this.relations = response.data;
      }).catch(error => {
        console.error(error);
      });
    },
    methods: {
      onSubmit () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$axios.post('http://localhost:8081/patient/registerPatient', JSON.stringify(this.ruleForm)).then(response => {
              if (response.data === true) {
                this.$notify.success('注册成功');
              }
            }).catch(error => {
              console.error(error);
              this.$notify.error('注册失败');
            });
          }
        });
      },
      offReset (form) {
        this.$refs[form].resetFields();
        this.ruleForm.date = '';
        this.ruleForm.moreAddress = '';
        this.selectProvince = '';
        this.selectCity = '';
      }
    },
    watch: {
      selectProvince: function () {
        this.ruleForm.province = this.selectProvince;
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.selectProvince === this.provinces[i].value) {
            this.citys = this.provinces[i].citys;
          }
        }
      },
      selectCity: function () {
        this.ruleForm.city = this.selectCity;
      }
    }
  };
</script>
<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .addPatient
    .el-input, .addPatient .el-input__inner
      display: inline-block
      width: 192px

    .el-form-item
      padding-right: 30px

    .el-form
      padding-bottom: 20px
      max-width: 1000px
      margin-left: auto
      margin-right: auto

    .el-textarea__inner
      width: 500px

    .demonstration
      color: #333
      font-size: 24px
      text-align: right

    .record
      font-size: 28px
      text-align: center

    .el-form-item
      display: inline-block

    .center
      text-align: center
      display: block
</style>
