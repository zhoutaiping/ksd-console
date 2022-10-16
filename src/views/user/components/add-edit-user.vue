
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="用户"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="user_name" label="用户名">
        <el-input v-model="form.user_name" class="input-box" />
      </el-form-item>
      <el-form-item prop="nick_name" label="昵称">
        <el-input v-model="form.nick_name" class="input-box" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder=" " type="email" class="input-box" />
      </el-form-item>
      <el-form-item v-if="options.mode === 'Create'" label="密码" prop="password">
        <el-input v-model="form.password" placeholder=" " type="password" class="input-box" />
      </el-form-item>
      <el-form-item prop="role_id" label="角色">
        <el-select v-model="form.role_id" class="input-box" placeholder="角色">
          <el-option
            v-for="item in role_list"
            :label="item.label"
            :key="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="备注" type="textarea" class="input-box" />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog';
function validatorName(rule, value, callback) {
  if (!value) callback(new Error(' '));
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5\_\-]{3,16}$/;
  if (!reg.test(value)) {
    callback(new Error('用名必须为3-16位的字母或者数字,下划线'));
  } else {
    callback();
  }
}

function validatorEmail(rule, value, callback) {
  if (!value) callback(new Error(' '));
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!reg.test(value)) {
    callback(new Error('请输入正确的邮箱格式'));
  } else {
    callback();
  }
}
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
        user_name: '',
        nick_name: '',
        email: '',
        password: '',
        role_id: '',
        remark: ''
      },
      role_list: [
        { label: '普通用户', value: 1 },
        { label: '管理员', value: 2 }
      ],
      rules: {
        user_name: [
          {
            required: true,
            validator: validatorName,
            trigger: 'blur'
          }
        ],
        email: [{ required: true, validator: validatorEmail, trigger: 'blur' }],
        password: [{ required: true, message: ' ', trigger: 'blur' }],
        role_id: [{ required: true, message: ' ', trigger: 'blur' }],
        nick_name: [],
        remark: []
      }
    };
  },

  methods: {
    afterOpen(form) {
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        this.loading = false;

        if (form.user_id && this.options.mode === 'Edit') {
          // this.getInfo({
          //   user_id: form.user_id,
          //   token: localStorage.getItem('token')
          // });
          this.form = Object.assign(this.formDefault, { ...form });
        }
      });
    },
    async getInfo(params) {
      try {
        const data = await this.FetchAccount.get('/user/info', params);
        this.form = Object.assign(this.formDefault, { ...data });
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
        id: this.form.user_id ? this.form.user_id : '',
        token: localStorage.getItem('token')
      };

      try {
        if (this.options.mode === 'Create') {
          await this.FetchAccount.post('/user/add', form);
        } else {
          await this.FetchAccount.post('/user/modify', form);
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
</style>