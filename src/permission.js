import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import getPageTitle from "@/utils/get-page-title";
import defaultSettings from "@public/settings";
import bootstrap from "@/core/bootstrap";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = []; // no redirect whitelist
if (!store.getters.default_api) {
  bootstrap();
}
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  let token = localStorage.getItem("token");
  if (token) {
    const account_console = store.getters.account_console;
    if (account_console && account_console.length > 0) {
      next();
    } else {
      await store.dispatch("user/getInfo");
      const accessRoutes = await store.dispatch(
        "permission/generateRoutes",
        window.location.host
      );
      router.addRoutes(accessRoutes);
      next({ ...to, replace: true });
    }
  } else {
    token = getQueryVariable("token");
    if (token) {
      const user_info = await store.dispatch("user/verifyToken", token);
      if (user_info.is_inner) {
        await store.dispatch("user/getInfo");
        const accessRoutes = await store.dispatch(
          "permission/generateRoutes",
          window.location.host
        );
        router.addRoutes(accessRoutes);
        next("/dashboard");
      } else {
        store.dispatch("user/logout").then((res) => {
          localStorage.clear();
          const default_host =
            store.getters.default_host || defaultSettings.default_host;
          window.location.href = "https://" + default_host + "?token=" + token;
        });
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        store.dispatch("user/logout").then((res) => {
          localStorage.clear();
          window.location.href =
            defaultSettings.signOutUrl +
            "?redirect_url=" +
            window.location.origin;
        });
      }
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

function getQueryVariable(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
