<template>
  <div class="register">
    <div style="text-align: center;font-size: 24px;
    margin-bottom: 25px;" class="register-title">挂 号 办 理</div>
    <el-form :model="register" :rules="rules" ref="registerForm" label-width="100px" class="register-ruleForm">
      <el-form-item label="患者姓名" prop="patientName" class="register-name">
        <el-input v-model="register.patientName"></el-input>
      </el-form-item>
      <el-form-item label="办理凭证" prop="certificate_value" class="register-certificate">
        <el-select v-model="register.certificate_value" placeholder="请选择办理凭证">
          <el-option label="身份证" value="idCard"></el-option>
          <el-option label="健康证" value="healthCard"></el-option>
        </el-select>
      </el-form-item>
      <p class="register-isshow" v-if="register.certificate_value === 'idCard'">
        <el-form-item label="身份证号" prop="cardNumber" class="register-name">
          <el-input v-model="card_number"></el-input>
        </el-form-item>
      </p>
      <p class="register-isshow" v-else-if="register.certificate_value === 'healthCard'">
        <el-form-item label="健康证号" prop="cardNumber" class="register-name">
          <el-input v-model="card_number"></el-input>
        </el-form-item>
      </p>
      <p v-else></p>
      <el-form-item label="科室" prop="department_value">
        <el-select v-model="departmentvalue" placeholder="请选择科室">
          <el-option v-for="items in department" :key="items.deptEngName" :label="items.deptName" :value="items.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="就诊医生" prop="doctor_value" class="register-certificate">
        <el-select v-model="doctorvalue" placeholder="请选择就诊医生">
          <el-option v-for="items in doctor" :key="items.id" :label="items.name" :value="items.name">
          </el-option>
        </el-select>
      </el-form-item>
      <p v-if="doctorvalue">
        <el-form-item label="就诊时间：" class="register-name">
          <span>{{ register.visit_date }}  {{ register.visit_time }}</span>
        </el-form-item>
      </p>
      <p v-if="doctorvalue">
        <el-form-item label="候诊号：" class="register-name">
          <span>{{ register.register_number }}</span>
        </el-form-item>
      </p>
      <p v-if="doctorvalue">
        <el-form-item label="挂号费：" class="register-name">
          <span>{{ register.expense }}元</span>
        </el-form-item>
      </p>
      <div style="text-align: center">
        <el-button type="primary" class="submitBtn" @click="submitForm('registerForm')">提交挂号</el-button>
        <el-button type="reset" @click="resetForm('registerForm')">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      let checkCertificate = (rule, value, callback) => {
        if (/^\d+$/.test(value) !== false) {
          if (value.length !== 18) {
            callback(new Error('身份证号应为18位数！'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请输入数字值！'));
        }
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
        card_number: '',
        departmentvalue: '',
        doctorvalue: '',
        department: [],
        doctor: [],
        rules: {
          patientName: [
            { required: true, message: '请输入患者姓名', trigger: 'blur' }
          ],
          certificate_value: [
            { required: true, message: '请选择办理凭证', trigger: 'change' }
          ],
          cardNumber: [
            {required: true, validator: checkCertificate, trigger: 'blur'}
          ],
          departmentvalue: [
            { required: true, message: '请至少选择一个科室', trigger: 'change' }
          ],
          doctorvalue: [
            { required: true, message: '请选择医生', trigger: 'change' }
          ],
          visit_time: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      };
    },
    created () {
      this.register.visit_time = this.compute_visitTime();
      this.register.visit_date = new Date().toLocaleDateString();
      this.register.register_number = this.compute_registerNumber();
      this.$http.get('http://localhost:8081/dept/all').then((response) => {
        this.department = response.data;
      }, response => {
        this.$notify.error({
          message: '数据请求失败'
        });
      });
    },
    methods: {
      submitForm (formName) {
        this.$refs.registerForm.validate((valid) => {
          console.log(JSON.stringify(this.register));
          if (valid) {
            this.$notify.success({
              message: '提交成功',
              type: 'success'
            });
          } else {
            this.$notify.error({
              message: '提交失败',
              type: 'error'
            });
            return false;
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
      }
    },
    watch: {
      departmentvalue: function () {
        this.register.department_value = this.departmentvalue;
        this.$http.get('http://localhost:8081/doctor/findBy?id=' + this.departmentvalue).then((response) => {
          this.doctor = [];
          this.register.doctor_value = '';
          for (let i = 0; i < response.data.length; i++) {
            this.doctor.push(response.data[i]);
          }
        }, response => {
          this.$notify.error({
            message: '数据请求失败'
          });
        });
      },
      doctorvalue: function () {
        this.register.doctor_value = this.doctorvalue;
        for (let i = 0; i < this.doctor.length; i++) {
          if (this.register.doctor_value === this.doctor[i].name) {
            this.register.expense = this.doctor[i].expense;
          }
        }
      },
      card_number: function () {
        if (this.card_number.length === 18 && this.register.certificate_value === 'idCard') {
          this.register.cardNumber = this.card_number;
          console.log(this.register.cardNumber);
          this.$http.get('http://localhost:8081/patient/queryIndentify?identifyNumber=' + this.card_number).then((response) => {
            if (response.data === true) {
              this.$notify.success({
                message: '身份已识别'
              });
            } else {
              this.$notify.error({
                message: '1秒后将跳转到信息注册页面'
              });
              setTimeout(() => {
                this.$router.push({path: 'addPatient'});
              }, 1000);
            };
          }, response => {
            this.$notify.error({
              message: '数据请求失败'
            });
          });
        };
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
