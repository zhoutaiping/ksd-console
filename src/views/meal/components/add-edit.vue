<style scoped>
.form-box {
  overflow-y: auto;
  max-height: 650px;
}
.form-box ::-webkit-scrollbar  {
  width: 10px;
}

.form-box ::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 5px;
}
.input-box {
  width: 400px;
}
::v-deep.el-input-number .el-input__inner {
  text-align: left;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="应用"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
      class="form-box"
    >
      <el-form-item prop="app_name" label="应用名称">
        <el-input v-model="form.app_name" disabled class="input-box" />
      </el-form-item>
      <el-form-item label="Access_Key" prop="access_key">
        <el-input v-model="form.access_key" disabled class="input-box"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" class="input-box">
          <el-option :value="1" label="启用"></el-option>
          <el-option :value="0" label="禁用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转发规则条数" prop="rule_num">
        <el-input-number v-model="form.rule_num" :controls="false" :precision="0" class="input-box"></el-input-number>
      </el-form-item>
      <el-form-item label="风险分组IP数" prop="risk_ip_count">
        <el-input-number
          v-model="form.risk_ip_count"
          :controls="false"
          :precision="0"
          class="input-box"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="普通分组IP数" prop="normal_ip_count">
        <el-input-number
          v-model="form.normal_ip_count"
          :controls="false"
          :precision="0"
          class="input-box"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="良好分组IP数" prop="good_ip_count">
        <el-input-number
          v-model="form.good_ip_count"
          :controls="false"
          :precision="0"
          class="input-box"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="是否上架appstore" prop="is_appstore">
        <el-select v-model="form.is_appstore" class="input-box">
          <el-option :value="1" label="已上架"></el-option>
          <el-option :value="0" label="未上架"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启混淆" prop="enable_fake_request">
        <el-select v-model="form.enable_fake_request" class="input-box">
          <el-option :value="1" label="开启"></el-option>
          <el-option :value="0" label="未开启"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="获取真实IP" prop="enable_real_ip">
        <el-select v-model="form.enable_real_ip" class="input-box">
          <el-option :value="1" label="是"></el-option>
          <el-option :value="0" label="否"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="传递真实IP" prop="proxy_realip">
        <el-select v-model="form.proxy_realip" class="input-box">
          <el-option :value="1" label="开"></el-option>
          <el-option :value="0" label="关"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端风险监测" prop="risk_control">
        <el-select v-model="form.risk_control" class="input-box">
          <el-option :value="1" label="是"></el-option>
          <el-option :value="0" label="否"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预置dns解析域名列表" prop="dns_domains">
        <el-input
          type="textarea"
          placeholder="'www.demo.com，多个域名以“，”隔开'"
          v-model="form.dns_domains"
          class="input-box"
        ></el-input>
      </el-form-item>
      <el-form-item label="静态风险等级" prop="static_level">
        <el-select v-model="form.static_level" class="input-box">
          <el-option :value="0" label="低风险"></el-option>
          <el-option :value="1" label="一般"></el-option>
          <el-option :value="2" label="高风险"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预置IP列表" prop="preset_ips">
        <el-input
          type="textarea"
          placeholder="127.1.1.1;多个域名以“，”隔开'"
          v-model="form.preset_ips"
          class="input-box"
        ></el-input>
      </el-form-item>
      <el-form-item label="禁止模拟器/虚拟机" prop="block_vm">
        <el-switch v-model="form.block_vm" :active-value="1" :inactive-value="0" />
        {{ form.block_vm === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="禁止root" prop="block_root">
        <el-switch v-model="form.block_root" :active-value="1" :inactive-value="0" />
        {{ form.block_root === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="禁止debug" prop="block_debug">
        <el-switch v-model="form.block_debug" :active-value="1" :inactive-value="0" />
        {{ form.block_debug === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="禁止群控" prop="block_groupctrl">
        <el-switch v-model="form.block_groupctrl" :active-value="1" :inactive-value="0" />
        {{ form.block_groupctrl === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="禁止多开" prop="block_multiinst">
        <el-switch v-model="form.block_multiinst" :active-value="1" :inactive-value="0" />
        {{ form.block_multiinst === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="禁止HOOK" prop="block_hook">
        <el-switch v-model="form.block_hook" :active-value="1" :inactive-value="0" />
        {{ form.block_hook === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="禁止VPN" prop="block_vpn">
        <el-switch v-model="form.block_vpn" :active-value="1" :inactive-value="0" />
        {{ form.block_vpn === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="禁止代理" prop="block_proxy">
        <el-switch v-model="form.block_proxy" :active-value="1" :inactive-value="0" />
        {{ form.block_proxy === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="模拟器" prop="block_simulator">
        <el-switch v-model="form.block_simulator" :active-value="1" :inactive-value="0" />
        {{ form.block_simulator === 1? '开启':'关闭'}}
      </el-form-item>
      <el-form-item label="检测控制台配置" prop="check_rls">
        <el-switch v-model="form.check_rls" :active-value="1" :inactive-value="0" />
        {{ form.check_rls === 1? '开启':'关闭'}}
      </el-form-item>

      <el-form-item label="默认端口" prop="default_port">
        <el-input
          type="textarea"
          v-model="form.default_port"
          placeholder="0-65535,多个域名以“，”隔开'"
          class="input-box"
        />
      </el-form-item>
      <el-form-item label="开启日志" prop="log_level">
        <el-select v-model="form.log_level" class="input-box">
          <el-option label="trace" value="trace" />
          <el-option label="debug" value="debug" />
          <el-option label="info" value="info" />
          <el-option label="warn" value="warn" />
          <el-option label="error" value="error" />
          <el-option label="fatal" value="fatal" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="备注" type="textarea" class="input-box" />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog';

const Label = {};

function portValidator(rule, value, callback) {
  value = value.toString().replace('，', ',');
  value = value.toString().split(',');
  if (value.length > 1000) callback(new Error('最多同时添加1000个端口'));
  callback();
}
export default createDialog({
  components: {},

  mixins: [],

  data() {
    return {
      loading: true,
      Label,
      optionsDefault: {
        batch: false,
        mode: 'Create',
        listView: []
      },
      formDefault: {
        app_name: '',
        rule_num: 200,
        status: 1,
        risk_ip_count: 3,
        normal_ip_count: 3,
        good_ip_count: 3,
        is_appstore: 0,
        enable_fake_request: 1,
        enable_real_ip: 0,
        risk_control: 1,
        dns_domains: '',
        static_level: 0,
        preset_ips: '',
        proxy_realip: 0,
        block_vm: 0,
        block_root: 0,
        block_debug: 0,
        block_multiinst: 0,
        block_groupctrl: 0,
        block_hook: 0,
        block_vpn: 0,
        block_proxy: 0,
        block_simulator: 0,
        default_port: '',
        block_simulator: 0,
        check_rls: 0,
        log_level: 'info',
        remark: ''
      },
      form: {},
      rules: {
        app_name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        rule_num: [],
        status: [],
        risk_ip_count: [],
        normal_ip_count: [],
        good_ip_count: [],
        is_appstore: [],
        enable_fake_request: [],
        enable_real_ip: [],
        risk_control: [],
        dns_domains: '',
        static_level: [],
        preset_ips: [],
        proxy_realip: [],
        block_vm: [],
        block_root: [],
        block_debug: [],
        block_multiinst: [],
        block_groupctrl: [],
        block_hook: [],
        block_vpn: [],
        block_proxy: [],
        block_simulator: [],
        default_port: [],
        block_simulator: [],
        check_rls: [],
        log_level: [],
        remark: []
      }
    };
  },

  methods: {
    afterOpen(form) {
      console.log(form);
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        if (form.sdk_id && form.tenant_id) {
          this.form = Object.assign(this.formDefault, { ...form });
          console.log({ ...this.form });
          // this.getInfo({
          //   token: localStorage.getItem('token'),
          //   sdk_id: form.sdk_id,
          //   tenant_id: form.tenant_id
          // });
        }
        this.loading = false;
      });
    },
    getInfo(params = {}) {
      this.FetchAccount.get('/sdk/info', params)
        .then(res => {
          console.log('----info', res);
          if (Object.keys(res)) {
            this.from = Object.assign(this.formDefault, res);
          }
        })
        .catch(e => {});
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error();
      });

      form = {
        ...this.form,
        token: localStorage.getItem('token')
      };

      try {
        await this.FetchAccount.post('/sdk/modify', form);
      } catch (e) {
        throw new Error();
      }
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS');
      this.$emit('submit');
      this.handleClose();
    }
  }
});
</script>
