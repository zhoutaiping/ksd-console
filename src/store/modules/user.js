import { login, logout, getInfo, signOut, verifyToken } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";
import Message from "ant-design-vue/lib/message";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  user_id: "",
  roles: [],
  account_console: [],
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_USER_ID: (state, user_id) => {
    state.user_id = user_id;
  },
  SET_USER_KK: (state, list) => {
    state.account_console = list;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ user_name: username.trim(), password: password })
        .then((res) => {
          console.log();
          localStorage.setItem("user", JSON.stringify(res));
          commit("SET_TOKEN", res.accessToken);
          setToken(res.accessToke);
          resolve();
        })
        .catch((error) => {
          localStorage.clear();
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state, dispatch }, token) {
    return new Promise((resolve, reject) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && Object.keys(user).length) {
        const { nick_name, user_name, avatar } = user;
        // console.log(user_name, nick_name);
        commit("SET_ROLES", ["admin"]);
        commit("SET_NAME", nick_name || user_name);
        commit("SET_AVATAR", avatar);
        commit("SET_USER_KK", ["andao-console"]);
        resolve(user);
      } else {
        reject();
      }
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      localStorage.clear();
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resetRouter();
      dispatch("tagsView/delAllViews", null, { root: true });
      resolve();
    });
  },

  verifyToken({ commit, state, dispatch }, token) {
    return new Promise((resolve, reject) => {
      verifyToken(token)
        .then((data) => {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(data));
          setToken();
          commit("SET_TOKEN", token);
          commit("SET_ROLES", ["admin"]);
          commit("SET_USER_ID", data.id);
          commit("SET_NAME", data.nick_name || data.user_name);
          commit("SET_AVATAR", data.avatar);
          commit("SET_INTRODUCTION", data.introduction);
          resolve(data);
        })
        .catch((e) => {
          reject();
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + "-token";

    commit("SET_TOKEN", token);
    setToken(token);

    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true,
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
