const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  user_id: (state) => state.user.user_id,
  avatar: (state) => state.user.avatar,
  introduction: (state) => state.user.introduction,
  roles: (state) => state.user.roles,
  account_console: (state) => state.user.account_console,
  permission_routes: (state) => state.permission.routes,
  errorLogs: (state) => state.errorLog.logs,
  default_api: (state) => state.settings.default_api,
  domain_suffix: (state) => state.settings.domain_suffix,
  tenant_prefix_url: (state) => state.settings.tenant_prefix_url,
  default_host: (state) => state.settings.default_host,
  signIn: (state) => state.settings.signIn,
  signOutUrl: (state) => state.settings.signOutUrl,
  domain_register_list: (state) => state.settings.domain_register_list,
  domain_service_list: (state) => state.settings.domain_service_list,
  node_cate_list: (state) => state.settings.node_cate_list,
  pool_cate_list: (state) => state.settings.pool_cate_list,
};
export default getters;
