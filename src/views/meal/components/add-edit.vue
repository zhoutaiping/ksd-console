<style scoped>
.input-box {
  width: 400px;
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
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="app_name" label="应用名称">
        <el-input v-model="form.app_name" class="input-box" />
      </el-form-item>
      <!-- <el-form-item
        prop="ip"
        label="用户"
      >
        <el-input
          v-model="form.ip"
          class="input-box"
        />
      </el-form-item>
      <el-form-item
        prop="ip"
        label="资源池"
      >
        <el-input
          v-model="form.SOUCRCE"
          class="input-box"
        />
      </el-form-item>-->
      <el-form-item label="备注">
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
// (
//   `sdk_id` int UNSIGNED NOT NULL COMMENT 'SDK自增ID主键',
//   `created_at` timestamp NULL DEFAULT NULL COMMENT '创建时间',
//   `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
//   `app_id` int UNSIGNED NOT NULL DEFAULT '0' COMMENT '所属应用ID',
//   `access_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'access_key',
//   `tenant_id` int UNSIGNED NOT NULL COMMENT '租户ID',
//   `status` int NOT NULL COMMENT '状态',
//   `remark` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '备注',
//   `rule_num` int NOT NULL DEFAULT '200' COMMENT '套餐转发规则条数',
//   `risk_ip_count` int UNSIGNED DEFAULT '3' COMMENT '风险分组 默认IP个数',
//   `normal_ip_count` int UNSIGNED DEFAULT '3' COMMENT '普通分组 默认IP个数',
//   `good_ip_count` int UNSIGNED DEFAULT '3' COMMENT '良好分组 默认IP个数',
//   `is_appstore` tinyint UNSIGNED DEFAULT '0' COMMENT '是否上架appstore 默认 0 未上架 1 已上架',
//   `enable_fake_request` tinyint UNSIGNED DEFAULT '1' COMMENT '开启混淆',
//   `enable_real_ip` tinyint UNSIGNED DEFAULT '0' COMMENT '获取真实IP',
//   `risk_control` tinyint UNSIGNED DEFAULT '1' COMMENT '终端风险监测',
//   `dns_domains` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '预置dns解析域名列表',
//   `static_level` tinyint(1) DEFAULT '1' COMMENT '静态风险等级 0低风险 1 一般 2 高风险',
//   `preset_ips` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '预置IP列表',
//   `proxy_realip` tinyint UNSIGNED DEFAULT '0' COMMENT '传递真实IP 0关 1 开',
//   `block_vm` tinyint UNSIGNED NOT NULL DEFAULT '0' COMMENT '禁止模拟器/虚拟机 禁止为1，否则为0 默认不禁止',
//   `block_root` tinyint UNSIGNED DEFAULT '0' COMMENT '禁止root 禁止为1，否则为0 默认不禁止',
//   `block_debug` tinyint UNSIGNED DEFAULT '0' COMMENT '禁止调试 禁止为1，否则为0 默认不禁止',
//   `block_multiinst` tinyint UNSIGNED DEFAULT '0' COMMENT '禁止多开 禁止为1，否则为0 默认不禁止',
//   `block_groupctrl` tinyint UNSIGNED DEFAULT '0' COMMENT '禁止群控 禁止为1，否则为0 默认不禁止',
//   `block_hook` tinyint UNSIGNED DEFAULT '0' COMMENT '禁止hook 禁止为1，否则为0 默认不禁止',
//   `block_vpn` tinyint UNSIGNED DEFAULT '0' COMMENT '禁止vpn 禁止为1，否则为0 默认不禁止',
//   `block_proxy` tinyint UNSIGNED DEFAULT '0' COMMENT '禁止代理 禁止为1，否则为0 默认不禁止',
//   `block_simulator` tinyint UNSIGNED DEFAULT '0' COMMENT '禁止为1，否则为0 默认不禁止',
//   `default_port` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT '默认使用端口',
//   `check_rls` tinyint UNSIGNED DEFAULT '0' COMMENT '检测控制台配置 默认0， 0 关 1 开',
//   `log_level` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT 'info' COMMENT '日志等级 默认info',
//   `pool_id` int DEFAULT '0' COMMENT '节点池ID',
//   `user_id` int DEFAULT '0'
// )
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
        remark: ''
      },
      form: {},
      rules: {
        app_name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
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
          this.form = Object.assign(this.formDefault, form);
          this.getInfo({
            token: localStorage.getItem('token'),
            sdk_id: form.sdk_id,
            tenant_id: form.tenant_id
          });
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
        ...this.form
      };

      try {
        // if (this.options.batch) {
        //   if (this.options.mode === 'Create') {
        //     await this.Fetch.post('V4/tjkd.app.domain.batch.add', form)
        //   } else {
        //     await this.Fetch.post('V4/tjkd.app.domain.batch.edit', form)
        //   }
        // } else {
        if (this.options.mode === 'Create') {
          await this.Fetch.post('/add', form);
        } else {
          await this.Fetch.post('/modify', form);
        }
        // }
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
