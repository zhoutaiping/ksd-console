<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="监控任务"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="name" label="任务名称">
        <el-input v-model="form.name" clearable class="input-box" />
      </el-form-item>
      <el-form-item prop="group" label="监控组">
        <el-select v-model="form.group" class="input-box">
          <el-option value="1" label="测试模板" />
          <el-option value="2" label="正式模板" />
        </el-select>
      </el-form-item>
      <el-form-item prop="template" label="监控模板">
        <el-select v-model="form.template" class="input-box">
          <el-option value="1" label="测试模板" />
          <el-option value="2" label="正式模板" />
        </el-select>
      </el-form-item>
      <el-form-item prop="http" label="监控协议">
        <el-select v-model="form.http" class="input-box">
          <el-option value="http" label="http" />
          <el-option value="https" label="https" />
        </el-select>
      </el-form-item>
      <el-form-item prop="port" label="监控端口">
        <el-input-number :controls="false" v-model="form.port" class="input-box" />
      </el-form-item>
      <el-form-item prop="methods" label="监控请求方法">
        <el-select v-model="form.methods" class="input-box">
          <el-option value="get" label="GET" />
          <el-option value="post" label="POST" />
          <el-option value="put" label="PUT" />
          <el-option value="delete" label="DELETE" />
        </el-select>
      </el-form-item>
      <el-form-item prop="host" label="监控host">
        <el-input v-model="form.host" clearable class="input-box" />
      </el-form-item>

      <el-form-item prop="url" label="监控路径">
        <el-input v-model="form.url" clearable class="input-box" />
      </el-form-item>
      <el-form-item prop="domain" label="预期HTTP状态码">
        <el-input v-model="form.domain" class="input-box" />
      </el-form-item>
      <el-form-item prop="domain" label="监控耗时">
        <el-input v-model="form.domain" clearable class="input-box" />
      </el-form-item>
      <el-form-item prop="domain" label="连续不可用次数">
        <el-input v-model="form.domain" clearable class="input-box" />
      </el-form-item>
      <el-form-item prop="domain" label="连续宕机限制">
        <el-input v-model="form.domain" clearable class="input-box" />
      </el-form-item>
      <el-form-item prop="domain" label="平均监控延时">
        <el-input v-model="form.domain" clearable class="input-box" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="备注" type="textarea" class="input-box" />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog';
import waf from '../../sdk/store/waf';
export default createDialog({
  name: 'AddEditTask',
  data() {
    return {
      formDefault: {
        name: '',
        domain: '',
        report: '',
        template: '',
        http: '',
        methods: '',
        http_sni: '',
        url: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        domain: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        port: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        template: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        http: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        methods: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        http_sni: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        url: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        remark: []
      }
    };
  },
  methods: {
    afterOpen(form) {
      this.$nextTick(async () => {
        this.$refs.Form && this.$refs.Form.clearValidate();
        this.form = Object.assign({ ...this.formDefault }, { ...form });
        if (form.uuid) {
          this.getDetail({ uuid: form.uuid });
        }
      });
    },
    async getDetail(params) {
      try {
        const data = await this.FetchAccount.get('/task/get', params);
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
        ...this.form,
        token: localStorage.getItem('token')
      };
      try {
        if (this.options.mode === 'Create') {
          await this.FetchAccount.post('/add', form);
        } else {
          await this.FetchAccount.post('/modify', form);
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