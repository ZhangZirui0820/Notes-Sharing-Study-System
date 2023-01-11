<template>
  <div class="register">
    <div class="logo"></div>
    <div class="sign-text">Sign Up</div>
    <div class="sign-form">
      <el-form
        :rules="formRules"
        label-position="top"
        :model="signInfo"
        size="small"
        class="form"
        ref="registerForm"
      >
        <el-form-item label="User ID" class="item" prop="userId">
          <el-input v-model="signInfo.userId" placeholder="userid">
            <i slot="prefix" class="el-input__icon el-icon-user-solid user"></i
          ></el-input>
        </el-form-item>
        <el-form-item label="New Password" class="item" prop="password">
          <el-input
            v-model="signInfo.password"
            type="password"
            placeholder="password"
            show-password
          >
            <i
              slot="prefix"
              class="el-input__icon iconfont el-icon-suo icon-suo suo"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item
          label="Confirm Password"
          class="item"
          prop="confirmPassword"
        >
          <el-input
            v-model="signInfo.confirmPassword"
            type="confirm password"
            placeholder="confirm password"
            show-password
          >
            <i
              slot="prefix"
              class="el-input__icon iconfont el-icon-suo icon-suo suo"
            ></i>
          </el-input>
        </el-form-item>
      </el-form>

      <div class="form-btn">
        <el-button
          class="sign-btn"
          round
          type="primary"
          @click="handlerRegisterSubmit"
        >
          SIGN UP
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from "@/network/login/index.js";
export default {
  data() {
    return {
      signInfo: {
        userId: "",
        password: "",
        confirmPassword: "",
      },
      formRules: {
        userId: [
          {
            required: true,
            message: "userId cannot be empty",
            trigger: "blur",
          },
          { validator: this.validUserId },
          {
            max: 20,
            message: "userId cannot exceed 20 characters",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "password cannot be empty",
            trigger: "blur",
          },
          {
            min: 3,
            max: 12,
            message: "password length should between 3 to 12 characters",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "Please comfirm password",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    handlerRegisterSubmit() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          if (this.validatePassword()) {
            const registerInfo = {
              userId: this.signInfo.userId,
              password: this.signInfo.password,
            };
            register(registerInfo).then(() => {
              this.$router.push("/login");
              this.$message.success("register successfully");
            });
          } else {
            this.$message.warning("two different passwords");
          }
        }
      });
    },
    validatePassword() {
      return this.signInfo.password === this.signInfo.confirmPassword;
    },
    validUserId(rule, value, cb) {
      const reg = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
      if (reg.test(value)) {
        cb();
      } else {
        cb(new Error("userId can only consist of numbers and letters"));
      }
    },
  },
};
</script>

<style lang="less">
.register {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(to top, #fff, #cce3f2);

  .logo {
    width: 43px;
    height: 43px;
    display: block;
    background: url(../../assets/logo.png) center no-repeat;
    background-size: 37px;
    border-radius: 10px;
    border: 1px solid #dcdcdc;
    background-color: #fff;
    margin-bottom: 25px;
  }

  .sign-text {
    font-weight: bold;
    font-size: 23px;
    margin-bottom: 20px;
  }

  .sign-form {
    background: #fff;
    border-radius: 5px;
    padding: 40px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 50px;

    .form {
      width: 260px;
    }

    .item {
      & > label {
        padding: 0px 0px 5px;
        font-weight: 900;
      }
      input {
        padding-left: 40px;
      }

      .user {
        color: #313746;
        border-right: 1px solid #eaebec;
        padding-right: 5px;
      }
      .suo {
        color: #313746;
        border-right: 1px solid #eaebec;
        padding-right: 5px;
      }
    }

    .form-btn {
      display: flex;
      margin-top: 24px;
      .sign-btn {
        flex: 1;
      }
    }
  }
}
</style>
