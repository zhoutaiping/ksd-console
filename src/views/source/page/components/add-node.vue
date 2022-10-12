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
      <el-form-item prop="ip_type" label="节点类型">
        <el-select v-model="form.ip_type" placeholder="节点类型" clearable class="input-box">
          <el-option :value="1" label="优质" />
          <el-option :value="2" label="良好" />
          <el-option :value="3" label="普通" />
          <el-option :value="4" label="风险" />
          <el-option :value="5" label="高风险" />
        </el-select>
      </el-form-item>
      <el-form-item prop="ip" label="IP">
        <el-input v-model="form.ip" type="textarea" placeholder="ip" class="input-box" />
      </el-form-item>
      <el-form-item prop="block_overseas" label="封禁海外">
        <el-checkbox v-model="form.block_overseas" :true-label="0" :false-label="1" />
      </el-form-item>
      <el-form-item prop="isp" label="ISP">
        <yd-form-select :selects="Label.ISP_TYPE" v-model="form.isp" class="input-box" />
        <!-- <el-input v-model="form.isp" class="input-box" /> -->
      </el-form-item>
      <el-form-item prop="location" label="归属地">
        <FormItemArea v-model="form.location" ref="FormItemArea" class="input-box" />
        <!-- <InputArea v-model="form.location" class="input-box" style="width: 400px;" /> -->
        <!-- <el-input v-model="form.location" placeholder class="input-box" /> -->
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
import FormItemArea from '@/components/FormItem/FormItemArea';
import InputArea from '@/components/Input/InputArea';
import RULE from '@/utils/verify';
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
  ],
  ISP_TYPE: [
    {
      label: '电信',
      value: 'dx'
    },
    {
      label: '联通',
      value: 'lt'
    },
    {
      label: '移动',
      value: 'yd'
    },
    {
      label: 'BGP',
      value: 'BGP'
    },
    {
      label: 'CN2',
      value: 'CN2'
    },
    {
      label: 'dxcn2',
      value: '国际线路'
    },
    {
      label: 'oth',
      value: '其他'
    }
  ]
};

function portValidator(rule, value, callback) {
  value = value.toString().replace('，', ',');
  value = value.toString().split(',');
  if (value.length > 1000) callback(new Error('最多同时添加1000个端口'));
  callback();
}
function validatorValue(message = '格式错误') {
  function _validator(rule, value, callback) {
    if (RULE.ipReg.test(value) || RULE.Ipv6Reg.test(value)) {
      callback();
    } else {
      callback(new Error(message));
    }
  }
  return _validator;
}
export default createDialog({
  components: { FormItemArea, InputArea },

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
        country: '',
        province: '',
        ip: '',
        ip_pool: 0,
        ip_type: 1,
        is_delete: 0,
        isp: '',
        location: [],
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
        ip: [
          { required: true, trigger: 'blur', message: '请填写IP' },
          { validator: validatorValue() }
        ],
        location: [],
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
        const data = await this.FetchAccount.get('/pool/node/detail', {
          id: this.form.id,
          token: localStorage.getItem('token')
        });

        this.form = Object.assign({ ...this.formDefault }, { ...data });
        let location = [];
        if (data.country) location.push(data.country);
        if (data.province) location.push(data.province);
        this.form.location = location;
      } catch (error) {
        return;
      }
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error();
      });
      if (this.form.location[0] === 'CN' && !this.form.location[1]) {
        this.$message.warning('请选择地区！');
        throw new Error();
      }
      form = {
        ...this.form,
        country: (this.form.location[0] && this.form.location[0]) || '',
        province: (this.form.location[1] && this.form.location[1]) || '',
        location: this.form.location.join(','),
        token: localStorage.getItem('token')
      };
      try {
        if (this.options.mode === 'Create') {
          await this.FetchAccount.post('/pool/node/add', form);
        } else {
          await this.FetchAccount.post('/pool/node/modify', form);
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
