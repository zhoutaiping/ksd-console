<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="监控节点"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="name" label="监测点名称">
        <el-input v-model="form.name" clearable class="input-box" />
      </el-form-item>
      <el-form-item prop="ipv4" label="IPV4">
        <el-input v-model="form.ipv4" clearable class="input-box" />
      </el-form-item>
      <el-form-item :prop="form.ipv6? 'ipv6' : ''" label="IPV6">
        <el-input v-model="form.ipv6" clearable class="input-box" />
      </el-form-item>
      <!-- <el-form-item prop="type" label="监测类型">
        <el-select v-model="form.type" class="input-box" placeholder="监测类型">
          <el-option label="节点监控" :value="1" />
          <el-option label="源站监控" :value="2" />
        </el-select>
      </el-form-item>-->
      <el-form-item prop="location" label="归属地">
        <FormItemArea v-model="form.location" ref="FormItemArea" class="input-box" />
      </el-form-item>
      <el-form-item prop="isp" label="线路">
        <yd-form-select :selects="Label.ISP_TYPE" clearable v-model="form.isp" class="input-box" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="备注" type="textarea" class="input-box" />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog';
import template from '../page/template.vue';
import FormItemArea from '@/components/FormItem/FormItemArea';
import RULE from '@/utils/verify';
import ISP from '@/constants/isp';
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
  ISP_TYPE: ISP
};
function portVaildate(rule, value, callback) {
  if (!value) callback(new Error('请填写'));
  value = parseInt(value, 10);
  if (value < 1 || value > 65535) {
    callback(new Error('端口有误1-65535'));
  }
  callback();
}

function validatorValue(message = '格式错误') {
  function _validator(rule, value, callback) {
    if (RULE.ipReg.test(value)) {
      callback();
    } else {
      callback(new Error(message));
    }
  }
  return _validator;
}
function validatorValue2(message = '格式错误') {
  function _validator(rule, value, callback) {
    if (RULE.Ipv6Reg.test(value)) {
      callback();
    } else {
      callback(new Error(message));
    }
  }
  return _validator;
}
export default createDialog({
  components: { template, FormItemArea },
  name: 'AddEditPrint',
  data() {
    return {
      Label,
      formDefault: {
        name: '',
        ipv4: '',
        ipv6: '',
        type: 1,
        location: [],
        country: '',
        province: '',
        city: '',
        isp: '',
        remark: '',
        status: 0
      },
      rules: {
        name: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        ipv4: [
          { required: true, trigger: ['blur', 'change'], message: '请填写IP' },
          { validator: validatorValue() }
        ],
        ipv6: [{ validator: validatorValue2() }],
        type: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        isp: [],
        location: [],
        country: [],
        province: [],
        city: [],
        remark: []
      }
    };
  },
  methods: {
    afterOpen(form) {
      this.$nextTick(async () => {
        this.$refs.Form && this.$refs.Form.clearValidate();
        this.form = Object.assign({ ...this.formDefault }, { ...form });
        let location = [];
        if (form.country) location.push(form.country);
        if (form.province) location.push(form.province);
        this.form.location = location;
      });
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error();
      });

      form = {
        ...this.form,
        token: localStorage.getItem('token'),
        country: (this.form.location[0] && this.form.location[0]) || '',
        province: (this.form.location[1] && this.form.location[1]) || ''
      };
      try {
        if (this.options.mode === 'Create') {
          await this.FetchAccount.post('/monitor/node/add', form);
        } else {
          await this.FetchAccount.post('/monitor/node/edit', form);
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

<style lang="scss" scoped>
.input-box {
  width: 400px;
  /deep/ .el-input__inner {
    text-align: left;
  }
}
</style>