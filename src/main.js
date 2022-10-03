import './public-path.js'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import store from './store'
import routes from './router'
import Element from 'element-ui'
import Cookies from 'js-cookie'
import * as filters from './filters' // global filters

import '@/core/use'
import '@/core/use-console'
import '@/core/use-stage'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@/styles/theme/index.css' // global css
import '@/styles/index.scss' // global css

import './icons' // icon
import './permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// 微前端
// let router = null
// let instance = null

// function render(props = {}) {
//   const { container } = props
//   router = new VueRouter({
//     base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/',
//     mode: 'history',
//     routes
//   })

//   instance = new Vue({
//     router,
//     store,
//     render: (h) => h(App)
//   }).$mount(container ? container.querySelector('#app') : '#app')
// }

// // 独立运行时
// if (!window.__POWERED_BY_QIANKUN__) {
//   render()
// }

// export async function bootstrap() {
//   console.log('[vue] vue app bootstraped')
// }
// export async function mount(props) {
//   console.log('[vue] props from main framework', props)
//   render(props)
// }
// export async function unmount() {
//   instance.$destroy()
//   instance.$el.innerHTML = ''
//   instance = null
//   router = null
// }
new Vue({
  el: '#app',
  router: routes,
  store,
  render: h => h(App)
})
