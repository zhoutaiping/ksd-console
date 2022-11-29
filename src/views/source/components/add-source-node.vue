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
    title="新增IP资源"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="node_ids" label="IP">
        <yd-form-select
          :selects="ipList"
          v-model="form.node_ids"
          filterable
          collapseTags
          multiple
          class="input-box"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog';

const Label = {
  protocol: [
    {
      label: 'TCP',
      value: 1
    },
    {
      label: 'UDP',
      value: 2
    }
  ],
  loading: [
    {
      label: '轮询',
      value: 1
    },
    {
      label: 'IP哈希',
      value: 2
    }
  ],
  sourceType: [
    {
      label: 'IP',
      value: 1
    },
    {
      label: '域名',
      value: 2
    }
  ]
};

function portValidator(rule, value, callback) {
  value = value.toString().replace('，', ',');
  value = value.toString().split(',');
  if (value.length > 1000) callback(new Error('最多同时添加1000个端口'));
  callback();
}
import { areaView } from '@/utils/filter';
import ISP from '@/constants/isp';

export default createDialog({
  components: {},

  mixins: [],
  props: {
    ips: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      areaView,
      ISP,
      Fetch: this.FetchAccount,
      loading: true,
      Label,
      optionsDefault: {
        batch: false,
        mode: 'Create',
        listView: []
      },
      formDefault: {
        // "risk_level": 1,
        node_ids: [],
        pool_id: Number(this.$route.params.id)
      },
      rules: {
        risk_level: [
          {
            required: true,
            message: '请选择风险等级',
            trigger: ['blur', 'change']
          }
        ],
        node_ids: [
          {
            type: 'array',
            required: true,
            message: '请选择IP',
            trigger: ['blur', 'change']
          }
        ]
      },
      ipList: []
    };
  },

  methods: {
    beforeOpen(form, option) {
      this.getIP();
    },
    afterOpen(form) {
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        this.loading = false;
        // if (this.options.mode === 'Edit') {
        //   this.getDetail();
        // }
      });
    },
    getIP(
      params = {
        page: 1,
        pageSize: 9999,
        node_cate: this.$route.query.pool_cate || 0,
        token: localStorage.getItem('token')
      }
    ) {
      this.ipList = [];
      this.Fetch.get('/pool/node/list', params).then(res => {
        let { list = [] } = res || {};
        list = list.filter(i => !this.ips.includes(i.id)) || [];
        this.ipList = list.map(i => {
          return {
            label:
              i.ip +
              this.formartValue(i, 'isp') +
              this.formartValue(i, 'location') +
              this.formartValue(i, 'risk_level') +
              this.formartValue(i, 'unshared') +
              this.formartValue(i, 'ip_type') +
              this.formartValue(i, 'remark'),
            value: i.id
          };
        });
      });
    },
    formartValue(data, prop) {
      if (prop === 'isp') {
        let isp = data[prop];
        isp = this.ISP.find(i => i.value === isp)
          ? this.ISP.find(i => i.value === isp).label
          : '';
        return '-' + isp;
      }
      if (prop === 'risk_level') {
        const risk_level = {
          1: '低风险',
          2: '中风险',
          3: '高风险'
        };
        return (risk_level[data[prop]] && '-' + risk_level[data[prop]]) || '';
      }
      if (prop === 'ip_type') {
        const ip_type = {
          1: '高风险',
          2: '中风险',
          3: '低风险'
        };
        return (ip_type[data[prop]] && '-' + ip_type[data[prop]]) || '';
      }
      if (prop === 'unshared') {
        return Number(data[prop]) === 1 ? '- 独享' : '- 共享';
      }
      if (prop === 'remark') {
        return data[prop] ? '-' + data[prop] : '';
      }
      if (prop === 'location') {
        let location = [];
        if (!!data[prop]) {
          location = (!!data[prop] && data[prop].split(',')) || [];
        }
        if (!location.length) {
          if (data.country) location.push(data.country);
          if (data.province) location.push(data.province);
        }
        return (location.length && '-' + this.areaView(location)) || '';
      }
    },
    async getDetail() {
      try {
        const data = await this.Fetch.get('/pool/node/detail', {
          id: this.form.id,
          token: localStorage.getItem('token')
        });
      } catch (error) {
        return;
      }
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error();
      });

      form = {
        ...this.form,
        node_ids: this.form.node_ids.join(','),
        token: localStorage.getItem('token')
      };

      try {
        // if (this.options.mode === 'Create') {
        await this.Fetch.post('/pool/node/batchBind', form);
        // } else {
        //   await this.Fetch.post('/pool/node/unBind', form);
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
