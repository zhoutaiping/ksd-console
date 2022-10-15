export default {
  // time 12:00:00
  time: /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/,
  // 1-100
  cacheTimeNumber: /^\d{1,}$/,
  dnsDomain:
    /^(\*\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)|([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/i,
  // 不带协议的域名
  domain:
    /^(?=^.{3,255}$)[a-zA-Z0-9_][-_a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-_a-zA-Z0-9]{0,62})+[^-_]$/,
  domainWithPan:
    /^(?=^.{3,255}$)[a-zA-Z0-9*][-_a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-_a-zA-Z0-9]{0,62})+[^-_]$/,
  // 带有端口号 /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  domainWithPort:
    /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/,
  // 带有端口号和路径的域名
  domainWithPortAndPath:
    /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))?((\/)(\S)+)?$/,
  // 带有结束.的域名
  domainWithLastPoint:
    /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.$/,
  // DNS解析的带点域名验证
  resolvingDomain:
    /^(?=^.{3,255}$)[_a-zA-Z0-9][-_a-zA-Z0-9]{0,62}(\.[_a-zA-Z0-9][-_a-zA-Z0-9]{0,62})+[^-_]$/,
  // Referer 域名验证
  refererDomain:
    /^(?=^.{3,254}$)[\.a-zA-Z0-9*][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
  // 带有端口号的IP
  ipWithPort:
    /^(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])(:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))?$/,
  // 防盗链黑白名单(支持通配符*域名格式)
  defenseReferDomain:
    /^(\*)|([A-Z0-9][A-Z0-9_-]*(?:\.[A-Z0-9][A-Z0-9_-]*)+):?(\d+)?$/i,
  // 有协议的url,以 http | https 开头
  defaultUrl: /^((http|https):\/\/)(.*)/i,
  // 有协议的url,以 http | https 开头 / 结尾
  urlMenu: /^((http|https):\/\/)(.*)\/$/i,
  httpUrl: /^((http):\/\/)(.*)/i,
  // 没有协议的url,以 / 开头
  noProtocolUrl: /^(\/)(.*)/i,
  // 协议可有可无的url:
  haveHttpOrNotUrl: /^(((http|https):\/)?\/)(.*)/i,
  // 中文、字母、数字以及下划线
  regChFig: /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/,
  // IP格式验证
  ipReg:
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
  // 内网IP
  ipLAN:
    /^(127\.0\.0\.1)|(localhost)|(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.((1[6-9])|(2\d)|(3[01]))\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})$/,
  // 10.0.0.0 - 10.255.255.255 172.16.0.0 - 172.31.255.255 192.168.0.0 - 192.168.255.255
  // 192私有IP验证
  ipCidr:
    /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2])$/,
  ipReg192:
    /^[1][9][2]\.[1][6][8]\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
  // 10私有IP验证
  ipReg10:
    /^[1][0]\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
  // 172私有IP验证
  ipReg172:
    /^[1][7][2]\.(([1][6|7|8|9])|([2]\d{1})|([3][0|1]))\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
  // 兼容CIDR格式的ip格式验证
  cidrREG:
    /^(((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))(\/([0-9]|1[0-9]|2[0-9]|3[0-2]))?(\r|\n|\r\n)?){1,4}$/,
  // ip区域段，例如192.168.1.1-192.168.2.2
  ipRangeReg:
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])-(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
  // 端口验证  另外  端口范围 1~65535
  port: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
  expPort: /^[0-9]*[1-9][0-9]*$/,
  // '/'开头
  slashBegin: /^(\/).*$/,
  // invoice
  // name 20个字节，允许输入汉字、数字、英文字母
  name: /^[a-zA-Z0-9\u4e00-\u9fa5]{3,16}$/,
  // 密钥格式
  key: /^[a-zA-Z0-9]{6,20}$/,
  // 带有号段验证的11位手机号
  strictMobile: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
  // mobile
  mobile: /^\d{11,18}$/,
  // telephone
  tel: /^\d{7,18}$/,
  // local telephone eg '0511-4405222'、'021-87888822'
  localTel: /^(\d{3}-?\d{8}|\d{4}-?\d{7})$/,
  // adress 100个字节，允许输入汉字、数字、英文字母、符号
  address: /^\S{1,100}$/,
  // bank_name 80个字节，允许输入汉字、数字、英文字母
  bankName: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,80}$/,
  // bank_account 公司开户行账号 只校验了位数
  bankAccount: /^\d{1,25}$/,
  // IPV4验证：
  Ipv4Reg:
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  // IPV6验证：
  Ipv6Reg:
    /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
  // 邮箱验证 ：old /^([\w-_]+(?:\.[\w-_]+)*)@(?:\w+\.)+\w+$/
  EmailReg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  // qq验证
  qq: /^[0-9]{5,12}$/,
  // 组织机构代码9位验证
  organizationCode: /^[a-zA-Z0-9]{9}$/,
  // 组织机构代码18位验证
  organizationCode18: /^[a-zA-Z0-9]{18}$/,
  // 加上分机的座机号码
  landline: /^(\d{3}-?\d{8}|\d{4}-?\d{7})(-?\d{1,5})?$/,
  statusCode: /^[0-9][0-9]{2}$/,
  hex: /^[0-9a-fA-F]{2}$/,
  password: /^\d{6,64}$/,
};
