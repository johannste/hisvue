<template>
  <div class="register">
    <div style="text-align: center;font-size: 24px;
    margin-bottom: 25px;" class="register-title">挂 号 办 理
    </div>
    <el-form :model="register" :rules="rules" ref="registerForm" label-width="100px" class="register-ruleForm">
      <el-form-item label="患者姓名" prop="patientName" class="register-name">
        <el-input disabled v-model="register.patientName" placeholder="请输入身份信息"></el-input>
      </el-form-item>
      <el-form-item label="办理凭证" prop="certificate_value" class="register-certificate">
        <el-select v-model="certificateValue" placeholder="请选择办理凭证">
          <el-option v-for="items in identifyType" :key="items.type" :label="items.type" :value="items.id">
          </el-option>
        </el-select>
      </el-form-item>
      <p class="register-isShow" v-if="register.certificate_value !== ''">
        <el-form-item label="证件号" prop="cardNumber" class="register-name">
          <el-input v-model="register.cardNumber"></el-input>
        </el-form-item>
      </p>
      <el-form-item label="科室" prop="department_value">
        <el-select v-model="departmentValue" placeholder="请选择科室">
          <el-option v-for="items in department" :key="items.id" :label="items.deptName" :value="items.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="就诊医生" prop="doctor_value" class="register-certificate">
        <el-select v-model="doctorValue" placeholder="请选择就诊医生">
          <el-option v-for="items in doctor" :key="items.id" :label="items.name" :value="items.name">
          </el-option>
        </el-select>
      </el-form-item>
      <p v-if="doctorValue">
        <el-form-item label="就诊时间：" class="register-name">
          <span>{{ register.visit_date }}  {{ register.visit_time }}</span>
        </el-form-item>
      </p>
      <p v-if="doctorValue">
        <el-form-item label="候诊号：" class="register-name">
          <span>{{ register.register_number }}</span>
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
        switch (this.register.certificate_value) {
        case 0:
          if (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(value) === false) {
            callback(new Error());
          } else {
            callback(checkIdentify());
            // TODO
          }
          break;
        }
      };
      let checkIdentify = (rule, value, callback) => {
        this.$http.get('http://localhost:8081/patient/queryIdentify?identifyNumber=' + this.register.cardNumber).then(response => {
          if (response.bodyText !== '') {
            this.register.patientName = response.bodyText;
          } else {
            this.register.patientName = '';
            // this.dialogVisible = true;
          }
        }, response => {
          console.log('数据请求失败');
        });
      };
      return {
        register: {
          patientName: '',
          certificate_value: '',
          cardNumber: '',
          department_value: '',
          doctor_value: '',
          visit_time: '',
          register_number: '',
          expense: '',
          visit_date: ''
        },
        dialogVisible: false,
        certificateValue: '',
        departmentValue: '',
        doctorValue: '',
        identifyType: [],
        department: [],
        doctor: [],
        rules: {
          patientName: [
            {required: true, message: '请输入身份信息', trigger: 'change'}
          ],
          certificateValue: [
            {required: true, message: '请选择办理凭证', trigger: 'change'}
          ],
          cardNumber: [
            {required: true, message: '未识别身份信息', validator: checkCertificate, trigger: 'blur'}
          ],
          departmentValue: [
            {required: true, message: '请至少选择一个科室', trigger: 'change'}
          ],
          doctorValue: [
            {required: true, message: '请选择医生', trigger: 'change'}
          ],
          visit_time: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]
        }
      };
    },
    created () {
      this.register.visit_time = this.compute_visitTime();
      this.register.visit_date = new Date().toLocaleDateString();
      this.register.register_number = this.compute_registerNumber();
      this.$http.get('http://localhost:8081/dept/all').then(response => {
        this.department = response.data;
      }, response => {
        console.log('科室获取失败');
      });
      this.$http.get('http://localhost:8081/patient/queryIdentifyType').then(response => {
        this.identifyType = response.data;
      }, response => {
        console.log('办理凭证获取失败');
      });
    },
    methods: {
      submitForm (formName) {
        console.log(JSON.stringify(this.register));
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            this.$notify.success({
              message: '提交成功'
            });
          } else {
            this.$notify.error({
              message: '提交失败'
            });
          }
        });
      },
      resetForm (formName) {
        this.$refs.registerForm.resetFields();
        this.departmentvalue = '';
      },
      compute_visitTime () {
        var hour = new Date().getHours();
        var minutes = new Date().getMinutes();
        var time = '';
        if (hour < 11) {
          time = '8:00 - 11:30';
        } else if (hour === 11) {
          if (minutes < 30) {
            time = '8:00 - 11:30';
          }
        } else {
          time = '14:00 - 17:30';
        }
        return time;
      },
      compute_registerNumber () {
        this.$http.get('http://localhost:8081/patient/getLastSerialNumber');
      },
      toRegistry () {
        this.$router.push({path: 'addPatient'});
      }
    },
    watch: {
      departmentValue: function () {
        this.register.department_value = this.departmentValue;
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
        this.register.doctor_value = this.doctorValue;
        for (let i = 0; i < this.doctor.length; i++) {
          if (this.register.doctor_value === this.doctor[i].name) {
            this.register.expense = this.doctor[i].expense;
          }
        }
      },
      certificateValue: function () {
        this.register.certificate_value = this.certificateValue;
      }
    }
  };
</script>

<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .register
    .register-ruleForm
      width: 30%
      margin: 0 auto
      padding-left: 20px
      .register-name
        width: 315px

  .register .el-input, .register .el-input__inner
    width: 210px
</style>
