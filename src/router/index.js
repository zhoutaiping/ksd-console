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
        meta: { title: "首页", icon: "dashboard", affix: true },
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
    path: "/meal",
    component: Layout,
    alwaysShow: true,
    meta: { title: "应用管理", icon: "tab" },
    redirect: "/list",
    children: [
      {
        path: "list",
        component: () => import("@/views/meal/page/list"),
        name: "MEAL_LIST",
        meta: { title: "应用列表", icon: "component", noCache: true },
      },
    ],
  },
  {
    path: "/source",
    component: Layout,
    alwaysShow: true,
    meta: { title: "资源池管理", icon: "tab" },
    redirect: "/node-list",
    children: [
      {
        path: "node-list",
        component: () => import("@/views/source/page/node-list"),
        name: "SOURCE_NODE",
        meta: { title: "节点列表", icon: "component", noCache: true },
      },
      {
        path: "source-list",
        component: () => import("@/views/source/page/source-list"),
        name: "SOURCE_SOURCE",
        meta: { title: "资源池管理", icon: "component", noCache: true },
      },
      {
        path: "source-list/:id",
        component: () => import("@/views/source/page/source-list-detail"),
        name: "SOURCE_SOURCE_detal",
        hidden: true,
        meta: {
          title: "节点列表",
          icon: "component",
          noCache: true,
          back: `SOURCE_SOURCE`,
        },
      },
    ],
  },
  {
    path: "/monitor",
    component: Layout,
    alwaysShow: true,
    meta: { title: "监控管理", icon: "tab" },
    redirect: "/monitor-task",
    children: [
      {
        path: "monitor-task",
        component: () => import("@/views/monitor/page/task"),
        name: "monitor-task",
        meta: { title: "监控任务", icon: "component", noCache: true },
      },
      {
        path: "task-dashboard/:id",
        component: () => import("@/views/monitor/page/task-dashboard"),
        name: "task-dashboard",
        meta: {
          title: "Dashboard",
          icon: "component",
          noCache: true,
          back: `monitor-task`,
        },
        hidden: true,
      },
      {
        path: "monitor-template",
        component: () => import("@/views/monitor/page/template"),
        name: "Smonitor_template",
        meta: { title: "监控模板", icon: "component", noCache: true },
      },
      {
        path: "monitor-group",
        component: () => import("@/views/monitor/page/monitoring-group"),
        name: "monitor_group",
        meta: { title: "监控组", icon: "component", noCache: true },
      },
      {
        path: "monitor-group/:id",
        hidden: true,
        component: () => import("@/views/monitor/page/monitoring-group-edit"),
        name: "monitor_template-server",
        meta: {
          title: "监控点管理",
          icon: "component",
          noCache: true,
          back: `monitor_group`,
        },
      },
      {
        path: "monitor-print",
        component: () => import("@/views/monitor/page/monitoring-print"),
        name: "monitor_print",
        meta: { title: "监控点", icon: "component", noCache: true },
      },
    ],
  },
  {
    path: "/sdk",
    component: Layout,
    alwaysShow: true,
    hidden: true,
    meta: { title: "SDK管理", icon: "tab" },
    redirect: "/meal-list",
    children: [
      {
        path: "meal-list",
        component: () => import("@/views/sdk/views/MealList/index"),
        name: "SDK_meal_list",
        meta: { title: "套餐列表", icon: "component", noCache: true },
      },
      // 业务列表
      {
        path: "business/:id",
        name: `sdk_business__id`,
        hidden: true,
        component: () => import("@/views/sdk/views/Business/Detail"),
        redirect: {
          name: `sdk_business__id__applicationAcceleration`,
        },
        meta: { title: "控制台" },
        children: [
          {
            path: "applicationSecurity",
            name: `sdk_business__id__applicationSecurity`,
            component: () =>
              import("@/views/sdk/views/Business/ApplicationSecurity/index"),
            meta: { title: "应用安全", back: `SDK_meal_list` },
          },
          {
            path: "applicationAcceleration",
            name: `sdk_business__id__applicationAcceleration`,
            component: () =>
              import("@/views/sdk/views/Business/ApplicationAcceleration"),
            meta: { title: "应用加速", back: `SDK_meal_list` },
          },
          {
            path: "businessSecurity",
            name: `sdk_business__id__BusinessSecurity`,
            component: () =>
              import("@/views/sdk/views/Business/BusinessSecurity"),
            meta: { title: "业务安全", back: `SDK_meal_list` },
          },
          {
            path: "networkSecurity",
            name: `sdk_business__id__NetworkSecurity`,
            component: () =>
              import("@/views/sdk/views/Business/NetworkSecurity"),
            meta: { title: "网络安全", back: `SDK_meal_list` },
          },
        ],
      },
      {
        path: "meal/:id",
        name: `SDK_meal__id`,
        hidden: true,
        component: () => import("@/views/sdk/views/MealList/Detail"),
        meta: { title: "管理", back: `SDK_meal_list` },
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
            meta: { title: "资源管理", back: `SDK_meal_list` },
          },
          {
            path: "logs",
            name: `sdk_explorer__logs`,
            component: () => import("@/views/sdk/views/Explorer/Logs"),
            meta: { title: "资源分配日志", back: `SDK_meal_list` },
          },
        ],
      },
      {
        path: "logs",
        name: `SDK_Log`,
        component: () => import("@/views/sdk/views/Log/index"),
        meta: { title: "操作记录", icon: "component" },
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
