
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="450px"
    title="修改密码"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right">
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>
  
  <script>
import createDialog from '@/utils/createDialog';
export default createDialog({
  components: {},

  mixins: [],

  data() {
    return {
      loading: true,
      optionsDefault: {
        batch: false,
        mode: 'Create'
      },
      formDefault: {
        id: '',
        password: ''
      },
      role_list: [
        { label: '管理员', value: 1 },
        { label: '普通用户', value: 2 }
      ],
      rules: {
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        remark: []
      }
    };
  },

  methods: {
    afterOpen(form) {
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        this.loading = false;

        if (form.user_id) {
          (this.form.id = form.user_id), (this.form.password = '');
        }
      });
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
        await this.FetchAccount.post('/user/reset/pass', form);
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
  width: 300px;
}
</style>