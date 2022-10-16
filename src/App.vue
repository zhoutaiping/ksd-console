<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <router-view />
    </a-locale-provider>
  </div>
</template>

<script>
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { getToken, setToken, removeToken } from '@/utils/auth';
import defaultSettings from '@public/settings';
function getQueryVariable(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
export default {
  name: 'App',
  components: { ALocaleProvider: ConfigProvider },
  data() {
    return {
      locale: zhCN
    };
  },
  methods: {}
};
</script>
