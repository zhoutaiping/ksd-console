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
    <el-form
      v-loading="loading"
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
    >
      <el-form-item prop="domain" label="域名">
        <el-input
          v-model="form.domain"
          :disabled="options.mode !=='Create'"
          placeholder="www.dome.com"
          class="input-box"
        />
      </el-form-item>
      <el-form-item prop="domain_register_name" label="域名注册商">
        <el-select
          v-model="form.domain_register_name"
          class="input-box"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in domain_register_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="domain_register_name" label="域名解析商">
        <el-select
          v-model="form.domain_service_name"
          class="input-box"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in domain_service_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="domain_email" label="Email">
        <el-input v-model="form.domain_email" class="input-box" plaaceholder="email" />
      </el-form-item>
      <el-form-item prop="domain_zone_id" label="Zone ID">
        <el-input v-model="form.domain_zone_id" class="input-box" plaaceholder="Zone ID" />
      </el-form-item>
      <el-form-item prop="domain_api_token" label="API TOKEN">
        <el-input v-model="form.domain_api_token" class="input-box" />
      </el-form-item>
      <el-form-item prop="pool_id" label="节点池">
        <yd-form-select
          :selects="poollist"
          v-model="form.pool_id"
          class="input-box"
          @change="changPool"
        />
      </el-form-item>
      <el-form-item prop="usable_node_count" label="节点可用个数">
        <el-input v-model="form.usable_node_count" readonly class="input-box" />
      </el-form-item>
      <template v-if="options.mode !=='Create'">
        <el-form-item label="当前解析地址">
          <el-input type="textarea" :disabled="options.mode !=='Create'" class="input-box"></el-input>
        </el-form-item>
        <el-form-item label="关联应用">
          <el-input v-model="form.app_name" :disabled="options.mode !=='Create'" class="input-box"></el-input>
        </el-form-item>
      </template>
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

function validatorValue(message = '格式错误') {
  function _validator(rule, value, callback) {
    if (RULE.dnsDomain.test(value) || RULE.domain.test(value)) {
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
      optionsDefault: {
        batch: false,
        mode: 'Create',
        listView: []
      },
      REGISTER: [],
      SERVICE: [],
      poollist: [],
      formDefault: {
        domain: '',
        domain_register_name: '',
        domain_service_name: '',
        domain_email: '',
        domain_zone_id: '',
        domain_api_token: '',
        pool_id: '',
        usable_node_count: 0,
        remark: '',
        status: 0
      },
      rules: {
        domain: [
          { required: true, trigger: 'blur', message: '请填写域名' },
          { validator: validatorValue() }
        ],
        domain_register_name: [
          { required: true, trigger: 'blur', message: ' ' }
        ],
        domain_service_name: [
          { required: true, trigger: 'blur', message: ' ' }
        ],
        domain_email: [
          { required: true, message: ' ', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        domain_zone_id: [{ required: true, trigger: 'blur', message: ' ' }],
        domain_api_token: [{ required: true, trigger: 'blur', message: ' ' }],
        pool_id: [{ required: true, trigger: 'blur', message: ' ' }],
        usable_node_count: [{ required: true, trigger: 'blur', message: ' ' }],
        remark: []
      }
    };
  },
  computed: {
    domain_register_list() {
      const list = this.$store.getters.domain_register_list || [];
      return list.map(i => {
        return {
          label: i.val,
          value: i.key
        };
      });
    },
    domain_service_list() {
      const list = this.$store.getters.domain_service_list || [];
      return list.map(i => {
        return {
          label: i.val,
          value: i.key
        };
      });
      return list;
    }
  },
  methods: {
    afterOpen(form) {
      this.getPool();
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        this.loading = false;
        if (this.options.mode === 'Edit') {
          this.getDetail();
        }
      });
    },
    async getPool(
      params = {
        page: 1,
        page_size: 99999
      }
    ) {
      this.poollist = [];
      try {
        const data = await this.FetchAccount.get('/pool/list', params);
        const { list = [] } = data || {};
        this.poollist =
          list.map(i => {
            return { label: i.pool_name, value: i.id, ...i };
          }) || [];
      } catch (error) {
        return;
      }
    },
    changPool(val) {
      const pool = (val && this.poollist.find(i => i.value === val)) || null;
      this.form.usable_node_count = val && pool ? pool.node_num || 0 : 0;
    },
    async getDetail() {
      this.loading = true;

      try {
        const data = await this.FetchAccount.get('/domain/detail', {
          domain_id: this.form.domain_id
        });
        this.form = Object.assign({ ...this.formDefault }, { ...data });
      } catch (error) {
        return;
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 200);
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
          await this.FetchAccount.post('/domain/add', form);
        } else {
          await this.FetchAccount.post('/domain/modify', form);
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
