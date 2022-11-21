module.exports = {
  title: "管理平台",

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: "production",
  logo: "https://auth.axisnow.xyz/img/logo/logo-02.png",
  // signIn: "https://account.axisnow.xyz/user/sign-in",
  // signOutUrl: "https://account.axisnow.xyz/user/sign-out",
  // logiUrl: "",

  tenant_prefix_url: ".axisnow.xyz",
  domain_suffix: "axisnow.xyz",
  default_host: "console.axisnow.xyz",
  signIn: "https://account.axisnow.xyz/user/sign-in",
  signOutUrl: "https://account.axisnow.xyz/user/sign-out",
};
