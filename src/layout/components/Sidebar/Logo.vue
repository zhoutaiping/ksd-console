<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/dashboard">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>-->
        <svg-icon icon-class="logo" class="sidebar-logo" style="margin-left:5px;color: #1e212a;" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/dashboard">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
        <svg-icon
          icon-class="logo"
          class="sidebar-logo"
          style="margin-left:16px;margin-right: 0px;color: #1e212a;"
        />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import defaulSetting from '@public/settings';
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: defaulSetting.title,
      logo: defaulSetting.logo
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  // background: #2b2f3a;
  text-align: left;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 50px;
      height: 50px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      //color: $menuActiveText;
      font-weight: 600;
      line-height: 50px;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      margin-left: 10px;
      letter-spacing: 1px;
    }
  }

  &.collapse {
    .sidebar-logo {
      width: 50px;
      height: 50px;
      margin-right: 0px;
    }
  }
}
</style>
