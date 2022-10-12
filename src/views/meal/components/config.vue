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
    title="资源池设置"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="pool_id" label="资源池">
        <yd-form-select :selects="poollist" v-model="form.pool_id" class="input-box" />
        <!-- <el-input v-model="form.SOUCRCE" class="input-box" /> -->
      </el-form-item>
      <el-form-item label="备注" prop="remark">
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
      Fetch: this.FetchAccount,
      API_INDEX: '/pool/list',
      loading: true,
      Label,
      optionsDefault: {
        batch: false,
        mode: 'Create',
        listView: []
      },
      formDefault: {
        pool_id: '',
        user_id: JSON.parse(localStorage.getItem('user')).id || '',
        remark: ''
      },
      rules: {
        pool_id: [{ required: true, message: '请选择资源池', trigger: 'blur' }],
        remark: [{}]
      },
      poollist: []
    };
  },

  methods: {
    afterOpen(form) {
      this.getPool();
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        this.loading = false;
      });
    },
    async getPool(
      params = {
        page: 1,
        page_size: 9999,
        token: localStorage.getItem('token')
      }
    ) {
      this.poollist = [];
      try {
        const data = await this.Fetch.get(this.API_INDEX, params);
        const { list = [] } = data || {};
        this.poollist =
          list.map(i => {
            return { label: i.pool_name, value: i.id };
          }) || [];
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
        user_id: Number(this.form.user_id),
        token: localStorage.getItem('token')
      };

      try {
        // if (this.options.batch) {
        //   if (this.options.mode === 'Create') {
        //     await this.Fetch.post('V4/tjkd.app.domain.batch.add', form);
        //   } else {
        //     await this.Fetch.post('V4/tjkd.app.domain.batch.edit', form);
        //   }
        // } else {
        // http://47.98.119.34:24680/sdk/modify
        // if (this.options.mode === 'Create') {
        await this.Fetch.post('/sdk/modify', form);
        // } else {
        //   await this.Fetch.post('V4/tjkd.app.domain.edit', form);
        // }
        // }
      } catch (e) {
        throw new Error();
      }
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS');
      this.$emit('init');
      this.handleClose();
    }
  }
});
</script>
