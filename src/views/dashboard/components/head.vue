<style lang="scss" scoped>
.header-box {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid rgba(229, 235, 255, 0.08);
  .head-conter {
    max-width: 1200px;
    margin: auto;
    padding-left: 0;
    height: 64px;
  }
}
.logo {
  display: inline-block;
  height: 100%;
  padding: 5px 0;
  .img {
    width: 160px;
  }
}
.box-r {
  float: right;
  height: 100%;
}
.bg-primary {
  background: $--color-primary;
}
.login-btn {
  width: 110px;
  height: 48px;
  font-size: 17px;
  line-height: 45px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(229, 235, 255, 0.08);
  margin: 10px 0;
  display: inline-block;
}
.link-item {
  width: 110px;
  height: 48px;
  font-size: 17px;
  line-height: 45px;
  font-weight: 500;
  color: #fff;
  text-align: center;
}
.avatar-wrapper {
  height: 100%;
  line-height: 45px;
  display: flex;
  align-items: center;
  color: #fff;
}
</style>

<template>
  <div class="header-box">
    <div class="head-conter">
      <div class="logo">
        <router-link to="/home">
          <!-- <img :src="login_console" alt="avatar_logo" class="img"> -->
        </router-link>
      </div>
      <div class="box-r">
        <router-link to="/dashboard">
          <div
            v-show="name"
            class="login-btn"
            style="border: none; position: relative; right: 20px; top: -10px;"
          >立即体验</div>
        </router-link>

        <div v-show="!name" class="login-btn bg-primary" @click="handleLogin">LogIn</div>
        <el-dropdown trigger="click" style="margin:10px 0;">
          <div v-show="name" class="avatar-wrapper">
            <el-avatar :src="account_th+'?imageView2/1/w/80/h/80'" size="medium" />
            <span style="margin-left:10px;">{{ name }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" style="margin:10px 0;">
            <el-dropdown-item>
              <router-link to="/dashboard">
                <div>控制台</div>
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <span style="display:block;" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import login_console from '@/assets/images/logo-console.svg';
import th_default from '@/assets/images/th.jpg';
import defaultSettings from '@public/settings';
import { removeToken } from '@/utils/auth';
export default {
  data() {
    return {
      login_console
    };
  },
  computed: {
    ...mapGetters(['user', 'avatar', 'name']),
    year() {
      return new Date().getFullYear();
    },
    account_th() {
      return this.avatar || th_default;
    }
  },
  methods: {
    handleLogin() {
      removeToken();
      const signIn = this.$store.getters.signIn || defaultSettings.signIn;
      if (signIn) {
        localStorage.clear();
        window.open(
          signIn + '?redirect_url=' + window.location.origin,
          '_self'
        );
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      const signOutUrl =
        this.$store.getters.signOutUrl || defaultSettings.signOutUrl;

      if (signOutUrl) {
        localStorage.clear();
        window.open(
          signOutUrl + '?redirect_url=' + window.location.origin,
          '_self'
        );
      }
    }
  }
};
</script>
