import defaultSettings from "@public/settings";

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings;

const state = {
  theme: "#1664FF",
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  domain_suffix: "",
  tenant_prefix_url: "",
  default_host: "",
  signIn: "",
  signOutUrl: "",
  user_role_type_list: [],
  default_api: "",
  domain_register_list: [],
  domain_service_list: [],
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  },
  DOMAIN_SUFFIX: (state, domain_suffix) => {
    state.domain_suffix = domain_suffix;
    if (domain_suffix) {
      state.tenant_prefix_url = "." + domain_suffix;
      state.default_host = "console." + domain_suffix;
      state.default_api = "https://account." + domain_suffix;
      state.signIn = "https://account." + domain_suffix + "/user/sign-in";
      state.signOutUrl = "https://account." + domain_suffix + "/user/sign-out";
    }
  },
  USER_ROLE_TYPE_LIST: (state, list) => {
    state.user_role_type_list = list;
  },
  DOMAIN_REGISTER_LIST: (state, list) => {
    state.domain_register_list = list;
  },
  DOMAIN_SERVICE_LIST: (state, list) => {
    state.domain_service_list = list;
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
