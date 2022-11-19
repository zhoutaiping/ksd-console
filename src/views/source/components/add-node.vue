
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="IP资源"
    @submit="handleSubmit"
  >
    <el-form
      v-loading="loading"
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
    >
      <el-form-item prop="ip_type" label="风险类型">
        <el-radio-group v-model="form.ip_type">
          <el-radio-button :label="1">高风险</el-radio-button>
          <el-radio-button :label="2">中风险</el-radio-button>
          <el-radio-button :label="3">低风险</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="options.mode === 'Create'" prop="ip_range" label="IP">
        <el-input
          v-model="form.ip_range"
          type="textarea"
          placeholder="例如：1.1.1.1,1.1.1.1-1.1.1.3,1.1.1.0/24多个换行，兼容CIDR格式/ip区域段"
          class="input-box"
        />
      </el-form-item>
      <el-form-item v-else prop="ip" label="IP">
        <el-input v-model="form.ip" type="textarea" placeholder="ip" class="input-box" />
      </el-form-item>
      <el-form-item prop="node_cate" label="节点类型">
        <el-select
          v-model="form.node_cate"
          :disabled="options.mode === 'Edit'"
          multiple
          collapse-tags
          clearable
          class="input-box"
        >
          <el-option
            v-for="item in node_cate_list"
            :key="item.val"
            :label="item.key"
            :disabled="item.disabled"
            :value="item.val"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="isp" label="ISP">
        <yd-form-select :selects="Label.ISP_TYPE" v-model="form.isp" class="input-box" />
      </el-form-item>
      <el-form-item prop="location" label="归属地">
        <FormItemArea v-model="form.location" ref="FormItemArea" class="input-box" />
        <!-- <InputArea v-model="form.location" class="input-box" style="width: 400px;" /> -->
      </el-form-item>
      <el-form-item prop="server_config" label="机器配置">
        <el-input v-model="form.server_config" placeholder class="input-box" />
      </el-form-item>
      <el-form-item>
        <el-form-item prop="block_overseas" class="form-item-inline">
          <el-checkbox
            v-model="form.block_overseas"
            :true-label="0"
            :false-label="1"
            style="margin-right: 10px;"
          />封禁海外
        </el-form-item>
        <el-form-item prop="unshared" class="form-item-inline">
          <el-checkbox
            v-model="form.unshared"
            :true-label="1"
            :false-label="0"
            style="margin-right: 10px;"
          />独享配置
        </el-form-item>
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

function portValidator(rule, value, callback) {
  value = value.toString().replace('，', ',');
  value = value.toString().split(',');
  if (value.length > 1000) callback(new Error('最多同时添加1000个端口'));
  callback();
}
function validatorBetchValue(message = '格式错误') {
  function _validator(rule, value, callback) {
    value = (value && value.toString().split(/[(\r\n)\r\n]+/)) || [];
    if (!value.length) callback(new Error('请填写IP'));
    const _e = value.find(i => {
      const error =
        RULE.ipReg.test(i) || RULE.cidrREG.test(i) || RULE.ipRangeReg.test(i);
      return error === false;
    });
    if (!_e) {
      callback();
    } else {
      callback(new Error(message));
    }
  }
  return _validator;
}
function validatorIPValue(message = '格式错误') {
  function _validator(rule, value, callback) {
    const error = RULE.ipReg.test(value);
    if (error) {
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
        block_overseas: 1,
        continent_country: '',
        country: '',
        province: '',
        ip_range: '',
        ip: '',
        ip_pool: 0,
        ip_type: 2,
        is_delete: 0,
        isp: '',
        location: [],
        node_cate: ['0'],
        remark: '',
        server_config: '',
        status: 0,
        task_uuid: '',
        unshared: 0
      },
      rules: {
        block_overseas: [],
        ip_pool: [{ required: true, message: ' ' }],
        ip_type: [{ required: true, message: ' ' }],
        isp: [{ required: true, message: ' ' }],
        ip_range: [
          { required: true, trigger: 'blur', message: '请填写IP' },
          { validator: validatorBetchValue() }
        ],
        ip: [
          { required: true, trigger: 'blur', message: '请填写IP' },
          { validator: validatorIPValue() }
        ],
        node_cate: [{ required: true, message: ' ' }],
        location: [],
        unshared: [],
        location: [],
        remark: []
      }
    };
  },
  computed: {
    node_cate_list() {
      const list = this.$store.getters.node_cate_list;
      return (
        list.map(i => {
          i.disabled = this.options.mode === 'Edit';
          return i;
        }) || []
      );
    }
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
      this.loading = true;

      try {
        const data = await this.FetchAccount.get('/pool/node/detail', {
          id: this.form.id,
          token: localStorage.getItem('token')
        });
        const _data = { ...data };
        data['location'] = setLocation(data);
        this.form = Object.assign({ ...this.formDefault }, { ...data });
        this.form.node_cate =
          (data.node_cate && data.node_cate.split(',')) || [];
        this.form.ip_type = Number(data.ip_type) === 0 ? '' : data.ip_type;
      } catch (error) {
        return;
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 200);
      }

      function setLocation(data) {
        let location = [];
        if (!!data.location) {
          location = data.location.split(',');
        }
        if (!location.length) {
          if (data.country) location.push(data.country);
          if (data.province) location.push(data.province);
        }

        return location;
      }
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error();
      });
      if (
        this.form.location &&
        this.form.location[0] === 'CN' &&
        !this.form.location[1]
      ) {
        this.$message.warning('请选择地区！');
        throw new Error();
      }
      form = {
        ...this.form,
        country: (this.form.location[0] && this.form.location[0]) || '',
        province: (this.form.location[1] && this.form.location[1]) || '',
        location: this.form.location.join(','),
        node_cate: (this.form.node_cate && this.form.node_cate.join(',')) || []
      };
      try {
        if (this.options.mode === 'Create') {
          const ip_range = this.form.ip_range.split(/[(\r\n)\r\n]+/);
          form['ip_range'] = ip_range.filter(i => i);
          delete form.ip;
          await this.FetchAccount.post('/pool/node/batchAdd', form);
        } else {
          delete form.ip_range;
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
<style scoped>
.input-box {
  width: 400px;
}
.form-item-inline {
  display: inline-block;
  margin-bottom: 0;
  margin-right: 20px;
}
</style>