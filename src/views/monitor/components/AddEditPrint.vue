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
        <el-input v-model="form.name" class="input-box" />
      </el-form-item>
      <el-form-item prop="ipv4" label="IPV4">
        <el-input v-model="form.ipv4" class="input-box" />
      </el-form-item>
      <el-form-item :prop="form.ipv6? 'ipv6' : ''" label="IPV6">
        <el-input v-model="form.ipv6" class="input-box" />
      </el-form-item>
      <el-form-item prop="type" label="监测类型">
        <el-select v-model="form.type" class="input-box" placeholder="监测类型">
          <el-option label="节点监控" :value="1" />
          <el-option label="源站监控" :value="2" />
        </el-select>
      </el-form-item>

      <el-form-item prop="location" label="归属地">
        <FormItemArea v-model="form.location" ref="FormItemArea" class="input-box" />
        <!-- <el-select
          v-model="form.country"
          class="input-box"
          placeholder
          filterable
          allow-create
          default-first-option
        ></el-select>-->
      </el-form-item>
      <!-- <el-form-item prop="province" label="省/地区">
        <el-select
          v-model="form.province"
          class="input-box"
          placeholder
          filterable
          allow-create
          default-first-option
        ></el-select>
      </el-form-item>
      <el-form-item prop="city" label="城市">
        <el-select
          v-model="form.city"
          class="input-box"
          placeholder
          filterable
          allow-create
          default-first-option
        ></el-select>
      </el-form-item>-->
      <el-form-item prop="isp" label="线路">
        <!-- {{form.isp}} -->
        <yd-form-select :selects="Label.ISP_TYPE" v-model="form.isp" class="input-box" />
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
        type: '',
        location: [],
        country: '',
        province: '',
        city: '',
        isp: '',
        remark: '',
        status: 0
      },
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        ipv4: [
          { required: true, trigger: 'blur', message: '请填写IP' },
          { validator: validatorValue() }
        ],
        ipv6: [{ validator: validatorValue2() }],
        type: [{ required: true, message: ' ', trigger: 'blur' }],
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
        this.$refs.Form.clearValidate();
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
        country: (this.form.location[0] && this.form.location[0]) || '',
        province: (this.form.location[1] && this.form.location[1]) || ''
      };
      console.log();
      try {
        if (this.options.mode === 'Create') {
          await this.Fetch.post('/monitor/node/add', form);
        } else {
          await this.Fetch.post('/monitor/node/edit', form);
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