<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <router-view />
    </a-locale-provider>
  </div>
</template>

<script>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { getToken, setToken, removeToken } from '@/utils/auth' 
import defaultSettings from '@/settings'
function getQueryVariable(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
export default {
  name: 'App',
  components: { ALocaleProvider: ConfigProvider },
  data() {
    return {
      locale: zhCN
    }
  },
  beforeMount() {
    if(['/login', '/', '/dashboard'].includes(this.$route.path)) {
      console.log(this.$route)
      this.signCallback()
    }  
  },
  methods:{
    async signCallback() {

      let Token
      if (process.env.NODE_ENV !== 'development') {
        Token = localStorage.getItem('token')
      } else {
        Token = localStorage.getItem('token')
      }

      if (Token) {
        setToken(Token)
        console.log("---------2")
        // this.$store.dispatch('user/verifyToken',Token).then(res =>{
          this.$router.push({ path: '/' })
        // })
        return
      }
      const _token = getQueryVariable('token') // defaultSettings.code
      const redirect_url = process.env.NODE_ENV !== 'development' ?  'http://admin.axisnow.xyz/' : 'http://localhost:4670/'
      if(!_token) {
        removeToken()
        localStorage.clear()
        if (defaultSettings.expireUrl) window.open(defaultSettings.expireUrl + '?redirect_url=' + redirect_url,'_self');
        return
      }
      try {
        Token = _token || Token
        setToken(Token)
        this.$store.dispatch('user/verifyToken',Token).then(res =>{
          this.$router.push({ path: '/' })
        })
       } catch (error) {
        window.open(defaultSettings.expireUrl + '?redirect_url=' + redirect_url,'_self');
        // window.location.href = defaultSettings.expireUrl + '?redirect_url=' + redirect_url
       }
    }
  }
}


</script>
