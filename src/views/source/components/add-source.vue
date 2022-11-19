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
    title-label="资源池"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="pool_name" label="资源池名称">
        <el-input v-model="form.pool_name" clearable class="input-box" />
      </el-form-item>
      <el-form-item prop="pool_cate" label="资源池类型">
        <yd-form-select
          v-model="form.pool_cate"
          :clearable="options.mode !== 'Edit'"
          :selects="pool_cate_list"
          placeholder="资源池类型"
          class="input-box"
        />
      </el-form-item>

      <el-form-item prop="risk_level" label="风险等级">
        <el-select v-model="form.risk_level" class="input-box">
          <el-option :value="1" label="低"></el-option>
          <el-option :value="2" label="中"></el-option>
          <el-option :value="3" label="高"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="监控模版" prop="monitor_template_uuid">
        <el-select v-model="form.monitor_template_uuid" clearable filterable class="input-box">
          <el-option
            v-for="item in template_list"
            :value="item.value"
            :key="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监控组" prop="monitor_group_uuid">
        <el-select v-model="form.monitor_group_uuid" clearable filterable class="input-box">
          <el-option
            v-for="item in group_list"
            :value="item.value"
            :key="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="unshared" label="是否独享">
        <el-checkbox v-model="form.unshared" :true-label="1" :false-label="0" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="备注" type="textarea" class="input-box" />
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
        is_delete: 0,
        pool_name: '',
        pool_uuid: '',
        remark: '',
        risk_level: 1,
        monitor_template_uuid: '',
        monitor_group_uuid: '',
        type: 0,
        pool_cate: '',
        unshared: 0
      },
      rules: {
        pool_name: [{ required: true, message: ' ', trigger: 'blur' }],
        risk_level: [{ required: true, message: ' ' }],
        unshared: [],
        remark: [],
        monitor_template_uuid: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        pool_cate: [{ required: true, message: ' ', trigger: 'blur' }],
        monitor_group_uuid: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      mode: 'Created',
      group_list: [],
      template_list: []
    };
  },
  computed: {
    pool_cate_list() {
      const list = this.$store.getters.pool_cate_list || [];

      return list.map(i => {
        return {
          label: i.key,
          value: i.val,
          disabled: this.options.mode === 'Edit'
        };
      });
    }
  },
  methods: {
    afterOpen(form) {
      const params = {
        page: 1,
        page_size: 99999,
        token: localStorage.getItem('token')
      };
      this.getGroup(params);
      this.getTemplate(params);
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        this.loading = false;
        if (form.id) {
          this.getDetail({
            id: Number(form.id),
            token: localStorage.getItem('token')
          });
        }
      });
    },
    async getGroup(params = { page: 1, page_size: 99999 }) {
      try {
        const data = await this.FetchAccount.post(
          '/monitor/group/list',
          params
        );
        let { list = [] } = data || {};
        list = list.filter(i => i.node_num > 0);
        this.group_list = list.map(i => {
          return {
            label: i.name + '-' + i.node_num + '节点',
            value: i.uuid
          };
        });
      } catch (error) {
        return;
      }
    },
    async getTemplate(params = { page: 1, page_size: 99999 }) {
      try {
        const data = await this.FetchAccount.post(
          '/monitor/template/list',
          params
        );
        const { list = [] } = data || {};
        this.template_list = list.map(i => {
          return {
            label: i.name,
            value: i.uuid
          };
        });
      } catch (error) {
        return;
      }
    },

    async getDetail(params = {}) {
      try {
        const data = await this.FetchAccount.get('pool/detail', params);
        this.form = { ...data };
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
        token: localStorage.getItem('token')
      };

      try {
        if (this.options.mode === 'Create') {
          await this.FetchAccount.post('/pool/add', form);
        } else {
          // http://47.98.119.34:24680/poolModify

          await this.FetchAccount.post('/pool/modify', form);
        }
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
