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
    title-label="IP资源"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="ip_pool" label="风险等级">
        <el-select v-model="form.ip_pool" placeholder="风险等级" clearable class="input-box">
          <el-option :value="2" label="良好池" />
          <el-option :value="1" label="普通池" />
          <el-option :value="0" label="风险池" />
        </el-select>
      </el-form-item>
      <el-form-item prop="ip_type" label="节点类型">
        <el-select v-model="form.ip_type" placeholder="节点类型" clearable class="input-box">
          <el-option :value="1" label="优质、良好" />
          <el-option :value="0" label="默认" />
        </el-select>
      </el-form-item>
      <el-form-item prop="ip" label="IP">
        <el-input v-model="form.ip" type="textarea" placeholder="ip" class="input-box" />
      </el-form-item>
      <el-form-item prop="block_overseas" label="封禁海外">
        <el-checkbox v-model="form.block_overseas" :true-label="0" :false-label="1" />
      </el-form-item>
      <el-form-item prop="isp" label="ISP">
        <el-input v-model="form.isp" class="input-box" />
      </el-form-item>
      <!-- <el-form-item
        prop="continent_country"
        label="大洲-国家"
      >
        <el-input
          v-model="form.continent_country"
          placeholder=""
          class="input-box"
        />
      </el-form-item>-->
      <el-form-item prop="location" label="归属地">
        <el-input v-model="form.location" placeholder class="input-box" />
      </el-form-item>
      <el-form-item prop="server_config" label="机器配置">
        <el-input v-model="form.server_config" placeholder class="input-box" />
      </el-form-item>
      <el-form-item prop="unshared" label="独享配置">
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
        block_overseas: 0,
        continent_country: '',
        ip: '',
        ip_pool: 0,
        ip_type: 0,
        is_delete: 0,
        isp: '',
        location: '',
        remark: '',
        server_config: '',
        status: 0,
        task_uuid: '',
        unshared: 0
      },
      rules: {
        block_overseas: [{ required: true, message: ' ' }],
        ip_pool: [{ required: true, message: ' ' }],
        ip_type: [{ required: true, message: ' ' }],
        isp: [{ required: true, message: ' ' }],
        ip: [{ required: true, message: ' ' }],
        unshared: [],
        location: [],
        remark: []
      }
    };
  },

  methods: {
    afterOpen(form) {
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        this.loading = false;
        if (this.options.mode === 'Edit') {
          this.getDetail();
        }
      });
    },
    async getDetail() {
      try {
        const data = await this.FetchAccount.get('/poolNodeDetail', {
          id: this.form.id
        });
        console.log(data);
      } catch (error) {
        return;
      }
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error();
      });

      form = {
        ...this.form
      };

      try {
        if (this.options.mode === 'Create') {
          await this.FetchAccount.post('/poolNodeAdd', form);
        } else {
          await this.FetchAccount.post('/poolNodeModify', form);
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
