<template>
  <section class="login">
    <div class="box">
      <!-- 头像 -->
      <div class="avater-box">
        <img src="../assets/images/login_logo.jpg" alt="login_logo" />
      </div>

      <!-- 表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules">
        <el-form-item class="i-password" prop="username">
          <el-input
            prefix-icon="icon-user iconfont"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            prefix-icon="icon-3702mima iconfont"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 按钮 -->
      <div class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.login {
  height: 100%;
  background-image: linear-gradient(45deg, #f6ced8, #81bef7);
  position: relative;

  .box {
    width: 450px;
    height: 300px;
    background-color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 0 20px;

    .avater-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .i-password {
      margin-top: 118px;
    }

    .btns {
      text-align: right;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    loginForm: {
      username: 'admin',
      password: '123456',
    },
    // 验证规则
    rules: {
      username: [
        { required: true, message: '请输入登录名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入登录密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
      ],
    },
  }),
  methods: {
    reset() {
      // @ts-ignore
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // @ts-ignore
      this.$refs.loginFormRef.validate(async (valid) => {
        // 验证未通过
        if (!valid) {
          return;
        }

        // @ts-ignore
        const result = (await this.$http.post('login', this.loginForm)).data;
        if (result.meta.status !== 200) {
          this.$message.error('登录失败！');
        } else {
          this.$message.success('登录成功！');

          // token只在网站打开生效，用sessionStorage
          window.sessionStorage.setItem('token', result.data.token);
          this.$router.push('/home');
        }
      });
    },
  },
});
</script>