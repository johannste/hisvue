<template>
  <div class="register">
    <el-form :model="register" :rules="rules" ref="registerForm" label-width="100px" class="register-ruleForm">
      <h1 class="register-title">挂号办理</h1><br/>
      <el-form-item label="患者姓名" prop="patientName" class="register-name">
        <el-input disabled v-model="register.patientName" placeholder="请输入身份信息"></el-input>
      </el-form-item>
      <el-form-item label="证件类型" prop="identifyType" class="register-certificate">
        <el-select v-model="certificateValue" placeholder="请选择办理凭证">
          <el-option v-for="items in identifyType" :key="items.type" :label="items.type" :value="items.id">
          </el-option>
        </el-select>
      </el-form-item>
      <p class="register-isShow" v-if="register.identifyType !== ''">
        <el-form-item label="证件号" prop="identifyNumber" class="register-name">
          <el-input v-model="register.identifyNumber"></el-input>
        </el-form-item>
      </p>
      <el-form-item label="科室" prop="departmentId">
        <el-select v-model="departmentValue" placeholder="请选择科室">
          <el-option v-for="items in department" :key="items.id" :label="items.deptName" :value="items.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="就诊医生" prop="doctorId" class="register-certificate">
        <el-select v-model="doctorValue" placeholder="请选择就诊医生">
          <el-option v-for="items in doctor" :key="items.id" :label="items.name" :value="items.id">
          </el-option>
        </el-select>
      </el-form-item>
      <p v-if="doctorValue">
        <el-form-item label="就诊日期：" class="register-name" prop="registerDate">
          <el-date-picker v-model="register.registerDate"
                          :editable="false"
                          @change="compute_time"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择就诊日期"
                          :picker-options="pickerOptions0"
                          prop="registerDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="就诊时段：" class="register-name" prop="diagnoseTime">
          <el-select v-model="register.diagnoseTime" placeholder="请选择就诊时段">
            <el-option v-for="items in timeRange" :key="items.id" :label="items.range" :value="items.id">
            </el-option>
          </el-select>
        </el-form-item>
      </p>
      <p v-if="doctorValue">
        <el-form-item label="候诊号：" class="register-name">
          <span>{{ register.registerNumber }}</span>
        </el-form-item>
      </p>
      <p v-if="doctorValue">
        <el-form-item label="挂号费：" class="register-name">
          <span>{{ register.expense }}元</span>
        </el-form-item>
      </p>
      <div style="text-align: center">
        <el-button type="primary" class="submitBtn" @click="submitForm('registerForm')">提交挂号</el-button>
        <el-button type="reset" @click="resetForm('registerForm')">重置</el-button>
      </div>
    </el-form>
    <el-dialog title="未能识别该身份" :visible.sync="dialogVisible">
      <h4>
        是否要跳转到注册页面
      </h4>
      <h5 slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">否</el-button>
        <el-button type="primary" @click="toRegistry()">是</el-button>
      </h5>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      let checkCertificate = (rule, value, callback) => {
        switch (this.register.identifyType) {
        case 0:
          if (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(value) === false) {
            callback(new Error());
          } else {
            this.$http.get('http://localhost:8081/patient/queryIdentify?identifyNumber=' + this.register.identifyNumber).then(response => {
              if (response.data.length === 1) {
                this.register.patientName = response.data[0].name;
                callback();
              } else {
                this.register.patientName = '';
                callback(new Error());
                this.dialogVisible = true;
              }
            }, response => {
              console.error('数据请求失败');
            });
          }
          break;
        }
      };
      return {
        register: {
          patientName: '',
          identifyType: '',
          identifyNumber: '',
          departmentId: '',
          doctorId: '',
          registerNumber: '',
          expense: '',
          registerDate: '',
          diagnoseTime: []
        },
        dialogVisible: false,
        certificateValue: '',
        departmentValue: '',
        doctorValue: '',
        identifyType: [],
        department: [],
        doctor: [],
        timeRange: [],
        pickerOptions0: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        rules: {
          patientName: [
            {required: true, message: '请输入身份信息', trigger: 'change'}
          ],
          identifyType: [
            {required: true}
          ],
          certificateValue: [
            {required: true, message: '请选择办理凭证', trigger: 'change'}
          ],
          identifyNumber: [
            {required: true, message: '未识别身份信息', validator: checkCertificate, trigger: 'blur'}
          ],
          departmentValue: [
            {required: true, message: '请至少选择一个科室', trigger: 'change'}
          ],
          departmentId: [
            {required: true}
          ],
          doctorId: [
            {required: true, message: '请选择医生', trigger: 'change'}
          ],
          registerDate: [
            {required: true}
          ],
          diagnoseTime: [
            {required: true}
          ]
        }
      };
    },
    created () {
      this.register.registerNumber = this.compute_registerNumber();
      this.$http.get('http://localhost:8081/dept/all').then(response => {
        this.department = response.data;
      }, response => {
        console.error('科室获取失败');
      });
      this.$http.get('http://localhost:8081/patient/queryIdentifyType').then(response => {
        this.identifyType = response.data;
      }, response => {
        console.error('办理凭证获取失败');
      });
      this.$http.get('http://localhost:8081/patient/queryDiagnoseTimeRange').then(response => {
        this.timeRange = response.data;
      }, response => {
        console.error('就诊时段获取失败');
      });
    },
    methods: {
      compute_time (time) {
        this.register.registerDate = time;
      },
      submitForm (formName) {
        console.log(JSON.stringify(this.register));
        this.$refs.registerForm.validate(valid => {
          // TODO
          // this.$http.post('http://localhost:8081/patient/registration', JSON.stringify(this.register)).then(response => {
          //   this.$notify.success({
          //     message: '注册成功'
          //   });
          // }, response => {
          //   this.$notify.error({
          //     message: '注册失败'
          //   });
          // });
        });
      },
      resetForm (formName) {
        this.$refs.registerForm.resetFields();
        this.departmentvalue = '';
      },
      compute_registerNumber () {
        this.$http.get('http://localhost:8081/patient/getLastSerialNumber').then(response => {
          this.register.registerNumber = response.bodyText;
        });
      },
      toRegistry () {
        this.$router.push({path: 'addPatient'});
      }
    },
    watch: {
      departmentValue: function () {
        this.register.departmentId = this.departmentValue;
        this.$http.get('http://localhost:8081/doctor/findBy?id=' + this.departmentValue).then(response => {
          this.doctor = [];
          this.doctorValue = '';
          for (let i = 0; i < response.data.length; i++) {
            this.doctor.push(response.data[i]);
          }
        }, response => {
          this.$notify.error({
            message: '数据请求失败'
          });
        });
      },
      doctorValue: function () {
        this.register.doctorId = this.doctorValue + '';
        for (let i = 0; i < this.doctor.length; i++) {
          if (this.register.doctorId === this.doctor[i].id + '') {
            this.register.expense = this.doctor[i].expense;
          }
        }
      },
      certificateValue: function () {
        this.register.identifyType = this.certificateValue;
      }
    }
  };
</script>

<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .register
    .register-title
     font-size: 28px
     text-align: center

    .register-ruleForm
      width: 30%
      margin: 0 auto
      padding-left: 20px

      .register-name
        width: 315px

    .el-input, .register .el-input__inner
      width: 210px
</style>
