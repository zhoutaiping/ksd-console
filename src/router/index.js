import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/news",
    component: () => import("@/views/dashboard/home"),
    hidden: true,
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    hidden: true,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "??????", icon: "dashboard", affix: true },
      },
    ],
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/app",
    component: Layout,
    alwaysShow: true,
    meta: { title: "????????????", icon: "Web-application-1" },
    redirect: "/list",
    children: [
      {
        path: "list",
        component: () => import("@/views/meal/page/list"),
        name: "MEAL_LIST",
        meta: { title: "????????????", icon: "yingyong", noCache: true },
      },
    ],
  },
  {
    path: "/source",
    component: Layout,
    alwaysShow: true,
    meta: { title: "????????????", icon: "pc1" },
    redirect: "/node-list",
    children: [
      {
        path: "node-list",
        component: () => import("@/views/source/page/node-list"),
        name: "SOURCE_NODE",
        meta: { title: "????????????", icon: "internet", noCache: true },
      },
      {
        path: "domian-list",
        component: () => import("@/views/source/page/domain-list"),
        name: "SOURCE_DOMAIN",
        meta: { title: "????????????", icon: "yumingliebiao", noCache: true },
      },
      {
        path: "domian-list/:id",
        component: () => import("@/views/source/page/domain-log"),
        name: "SOURCE_DOMAIN_LOG",
        hidden: true,
        meta: {
          title: "??????????????????",
          icon: "yumingliebiao",
          noCache: true,
          back: `SOURCE_DOMAIN`,
        },
      },
      {
        path: "source-list",
        component: () => import("@/views/source/page/source-list"),
        name: "SOURCE_SOURCE",
        meta: { title: "???????????????", icon: "ziyuan", noCache: true },
      },
      {
        path: "source-list/:id",
        component: () => import("@/views/source/page/source-list-detail"),
        name: "SOURCE_SOURCE_detal",
        hidden: true,
        meta: {
          title: "????????????",
          icon: "component",
          noCache: true,
          back: `SOURCE_SOURCE`,
        },
      },
    ],
  },
  {
    path: "/Monitor",
    component: Layout,
    alwaysShow: true,
    meta: { title: "????????????", icon: "zhongduanjiankong" },
    redirect: "/Monitor-task",
    children: [
      {
        path: "Monitor-task",
        component: () => import("@/views/monitor/page/task"),
        name: "monitor-task",
        meta: { title: "????????????", icon: "renwu", noCache: true },
      },
      {
        path: "Monitor-dashboard/:id",
        component: () => import("@/views/monitor/page/task-dashboard"),
        name: "task-dashboard",
        meta: {
          title: "Dashboard",
          icon: "",
          noCache: true,
          back: `monitor-task`,
        },
        hidden: true,
      },
      {
        path: "Monitor-template",
        component: () => import("@/views/monitor/page/template"),
        name: "Smonitor_template",
        meta: { title: "????????????", icon: "moban", noCache: true },
      },
      {
        path: "Monitor-group",
        component: () => import("@/views/monitor/page/monitoring-group"),
        name: "monitor_group",
        meta: { title: "?????????", icon: "fenzuguanli", noCache: true },
      },
      {
        path: "Monitor-group/:id",
        hidden: true,
        component: () => import("@/views/monitor/page/monitoring-group-edit"),
        name: "monitor_template-server",
        meta: {
          title: "???????????????",
          icon: "jiedianleizhukongzhongxin2",
          noCache: true,
          back: `monitor_group`,
        },
      },
      {
        path: "Monitor-print",
        component: () => import("@/views/monitor/page/monitoring-print"),
        name: "monitor_print",
        meta: {
          title: "?????????",
          icon: "jiedianleizhukongzhongxin2",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/sdk",
    component: Layout,
    alwaysShow: true,
    hidden: true,
    meta: { title: "SDK??????", icon: "tab" },
    redirect: "/meal-list",
    children: [
      {
        path: "meal-list",
        component: () => import("@/views/sdk/views/MealList/index"),
        name: "SDK_meal_list",
        meta: { title: "????????????", icon: "component", noCache: true },
      },
      // ????????????
      {
        path: "business/:id",
        name: `sdk_business__id`,
        hidden: true,
        component: () => import("@/views/sdk/views/Business/Detail"),
        redirect: {
          name: `sdk_business__id__applicationAcceleration`,
        },
        meta: { title: "?????????" },
        children: [
          {
            path: "applicationSecurity",
            name: `sdk_business__id__applicationSecurity`,
            component: () =>
              import("@/views/sdk/views/Business/ApplicationSecurity/index"),
            meta: { title: "????????????", back: `SDK_meal_list` },
          },
          {
            path: "applicationAcceleration",
            name: `sdk_business__id__applicationAcceleration`,
            component: () =>
              import("@/views/sdk/views/Business/ApplicationAcceleration"),
            meta: { title: "????????????", back: `SDK_meal_list` },
          },
          {
            path: "businessSecurity",
            name: `sdk_business__id__BusinessSecurity`,
            component: () =>
              import("@/views/sdk/views/Business/BusinessSecurity"),
            meta: { title: "????????????", back: `SDK_meal_list` },
          },
          {
            path: "networkSecurity",
            name: `sdk_business__id__NetworkSecurity`,
            component: () =>
              import("@/views/sdk/views/Business/NetworkSecurity"),
            meta: { title: "????????????", back: `SDK_meal_list` },
          },
        ],
      },
      {
        path: "meal/:id",
        name: `SDK_meal__id`,
        hidden: true,
        component: () => import("@/views/sdk/views/MealList/Detail"),
        meta: { title: "??????", back: `SDK_meal_list` },
      },
      {
        path: "explorer/:id",
        name: `sdk_explorer`,
        hidden: true,
        component: () => import("@/views/sdk/views/Explorer/index"),
        redirect: {
          name: `sdk_explorer__manage`,
        },
        children: [
          {
            path: "manage",
            name: `sdk_explorer__manage`,
            component: () => import("@/views/sdk/views/Explorer/Manage"),
            meta: { title: "????????????", back: `SDK_meal_list` },
          },
          {
            path: "logs",
            name: `sdk_explorer__logs`,
            component: () => import("@/views/sdk/views/Explorer/Logs"),
            meta: { title: "??????????????????", back: `SDK_meal_list` },
          },
        ],
      },
      {
        path: "logs",
        name: `SDK_Log`,
        component: () => import("@/views/sdk/views/Log/index"),
        meta: { title: "????????????", icon: "component" },
      },
    ],
  },
  {
    path: "/User",
    name: "User",
    meta: {
      title: "????????????",
      icon: "xitongshezhi",
    },
    component: Layout,
    alwaysShow: true,
    redirect: {
      name: `user-list`,
    },
    children: [
      {
        path: "user-list",
        component: () => import("@/views/user/page/user-list"),
        name: "user-list",
        meta: { title: "????????????", icon: "user", noCache: true },
      },
    ],
  },
  {
    path: "/analysis",
    name: "Analysis",
    meta: {
      title: "????????????",
      icon: "anquanyunyingfenxishitu",
    },
    component: Layout,
    alwaysShow: false,
    redirect: {
      name: `Analysis-list`,
    },
    children: [
      {
        path: "Analysis-list",
        component: () => import("@/views/analysis/index"),
        name: "Analysis-list",
        hidden:true,
        redirect: {
          name: `online-today`,
        },
        meta: { title: "????????????", icon: "anquanyunyingfenxishitu", noCache: true },
        children:[
          {
            path: "online-today",
            component: () => import("@/views/analysis/online-today"),
            name: "online-today",
            hidden:true,
            meta: { title: "", icon: "anquanyunyingfenxishitu", noCache: true },
          },{
            path: "history-flow",
            component: () => import("@/views/analysis/history-flow"),
            name: "history-flow",
            hidden:true,
            meta: { title: "", icon: "anquanyunyingfenxishitu", noCache: true },
          },{
            path: "history-forward",
            component: () => import("@/views/analysis/history-forward"),
            name: "history-forward",
            hidden:true,
            meta: { title: "", icon: "anquanyunyingfenxishitu", noCache: true },
          },{
            path: "project-flow",
            component: () => import("@/views/analysis/project-flow"),
            name: "project-flow",
            hidden:true,
            meta: { title: "", icon: "anquanyunyingfenxishitu", noCache: true },
          },{
            path: "player-rank",
            component: () => import("@/views/analysis/player-rank"),
            name: "player-rank",
            hidden:true,
            meta: { title: "", icon: "anquanyunyingfenxishitu", noCache: true },
          },{
            path: "node-request",
            component: () => import("@/views/analysis/node-request"),
            name: "node-request",
            hidden:true,
            meta: { title: "", icon: "anquanyunyingfenxishitu", noCache: true },
          },{
            path: "version",
            component: () => import("@/views/analysis/version"),
            name: "version",
            hidden:true,
            meta: { title: "", icon: "anquanyunyingfenxishitu", noCache: true },
          },{
            path: "terminal-risk",
            component: () => import("@/views/analysis/terminal-risk"),
            name: "terminal-risk",
            hidden:true,
            meta: { title: "", icon: "anquanyunyingfenxishitu", noCache: true },
          }
        ]
      },
    ],
  },
  {
    path: "/icon",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/icons/index"),
        name: "Icons",
        meta: { title: "Icons", icon: "icon", noCache: true },
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
