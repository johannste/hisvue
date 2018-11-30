<template>
  <div class="home" v-if="home.title">
    <div class="homeHead">
      <h2>{{home.title}}</h2>
    </div>

    <div><strong>医院系统部分功能块介绍</strong></div>

    <h4>挂号模块</h4>
    <ul>
      <li v-for="item in home.introduce.cashier">
        {{item}}
      </li>
    </ul>

    <h4>登录模块</h4>
    <ul>
      <li v-for="item in home.introduce.register">
        {{item}}
      </li>
    </ul>

  </div>
</template>

<script type="text/ecmascript-6">
  import {api} from '../../global/api.js';

  export default {
    data () {
      return {
        home: []
      };
    },
    created () {
      this.$http.get(api.home).then((response) => {             // mark
        this.home = response.body.home;
      }, response => {
        this.$message.error('数据请求失败');
      });
    }
  };
</script>

<style lang="stylus-loader" rel="stylesheet/stylus" type="text/stylus">
  .home
    padding: 0 20px 0 30px

  .home h2
    font-size: 30px
    text-align: center
    line-height: 90px
    font-weight: 800

  .home h4
    font-size: 18px
    line-height: 50px

  .home strong
    font-weight: 500
    font-size: 24px
    line-height: 80px

  .home li
    line-height: 20px
    padding: 0 0 20px 10px
</style>
