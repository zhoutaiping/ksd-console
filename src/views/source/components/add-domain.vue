<style scoped>
.input-box {
  width: 400px;
}
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="域名"
    :submitStatus="is_domain_check"
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
          clearable
          :disabled="options.mode !=='Create'"
          placeholder="www.dome.com"
          class="input-box"
        />
      </el-form-item>
      <el-form-item prop="domain_register_name" label="域名注册商">
        <el-input v-model="form.domain_register_name" clearable class="input-box" />
      </el-form-item>
      <el-form-item prop="domain_service_name" label="域名解析商">
        <yd-form-select
          v-model="form.domain_service_name"
          :selects="domain_service_list"
          clearable
          filterable
          class="input-box"
        />
      </el-form-item>
      <el-form-item prop="domain_email" label="Email">
        <el-input v-model="form.domain_email" clearable class="input-box" plaaceholder="email" />
      </el-form-item>
      <el-form-item prop="domain_zone_id" clearable label="Zone ID">
        <el-input v-model="form.domain_zone_id" clearable class="input-box" plaaceholder="Zone ID" />
      </el-form-item>
      <el-form-item prop="domain_api_token" label="API Key">
        <el-input v-model="form.domain_api_token" class="input-box" />
      </el-form-item>
      <el-form-item prop="pool_id" label="内置域名节点池">
        <yd-form-select
          v-model="form.pool_id"
          :selects="poolList"
          filterable
          clearable
          class="input-box"
        />
      </el-form-item>
      <el-form-item prop="usable_node_count" label="可用节点IP个数">
        <el-input-number
          v-model="form.usable_node_count"
          :controls="false"
          :min="1"
          :precision="0"
          class="input-box"
        />
      </el-form-item>
      <template v-if="options.mode !=='Create'">
        <el-form-item label="当前解析地址">
          <el-input
            v-model="form.dns_ip"
            :disabled="options.mode !=='Create'"
            class="input-box"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="关联应用">
          <el-input
            v-model="form.app_names"
            type="textarea"
            :disabled="options.mode !=='Create'"
            class="input-box"
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item label="备注" style="margin-bottom: 10px">
        <el-input v-model="form.remark" placeholder="备注" type="textarea" class="input-box" />
      </el-form-item>
      <el-form-item label style="margin-bottom: 0px">
        <DmAlert class="input-box">
          <template>
            {{changeLabel}}
            <el-button type="text" @click="checkDomain">点击检测</el-button>
            <p
              v-if="domain_check_desc && domain_check_desc !=='default'"
              class="red--color"
            >{{domain_check_desc}}</p>
            <p
              v-else-if="!is_domain_check && domain_check_desc !=='default'"
              class="success--color"
            >连接成功</p>
          </template>
        </DmAlert>
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
      poolList: [],
      formDefault: {
        domain: '',
        domain_register_name: '',
        domain_service_name: '',
        domain_email: '',
        domain_zone_id: '',
        domain_api_token: '',
        pool_id: '',
        usable_node_count: 3,
        remark: '',
        status: 1,
        app_names: '',
        dns_ip: ''
      },
      rules: {
        domain: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请填写域名'
          },
          { validator: validatorValue() }
        ],
        domain_register_name: [],
        domain_service_name: [
          { required: true, trigger: ['blur', 'change'], message: ' ' }
        ],
        domain_email: [
          { required: true, message: ' ', trigger: ['blur', 'change'] },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        domain_zone_id: [
          { required: true, trigger: ['blur', 'change'], message: ' ' }
        ],
        domain_api_token: [
          { required: true, trigger: ['blur', 'change'], message: ' ' }
        ],
        pool_id: [
          { required: true, trigger: ['blur', 'change'], message: ' ' }
        ],
        usable_node_count: [
          { required: true, trigger: ['blur', 'change'], message: ' ' }
        ],
        remark: []
      },
      changeLabel: '域名信息完善，请确保连接成功再添加',
      is_domain_check: true,
      domain_check_desc: 'default',
      default_model: {}
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
    }
  },
  watch: {
    'form.domain': {
      handler(val) {
        if (val !== this.default_model.domain) {
          this.is_domain_check = true;
          this.changeLabel = '域名信息改变，请确保连接成功再添加';
        }
      }
    },
    'form.domain_email': {
      handler(val) {
        if (val !== this.default_model.domain_email) {
          this.is_domain_check = true;
          this.changeLabel = 'Email 改变，请确保连接成功再添加';
        }
      }
    },
    'form.domain_service_name': {
      handler(val) {
        if (val !== this.default_model.domain_service_name) {
          this.is_domain_check = true;
          this.changeLabel = '域名解析商改变，请确保连接成功再添加';
        }
      }
    },
    'form.domain_zone_id': {
      handler(val) {
        if (val !== this.default_model.domain_zone_id) {
          this.is_domain_check = true;
          this.changeLabel = 'Zone ID 改变，请确保连接成功再添加';
        }
      }
    },
    'form.domain_api_token': {
      handler(val) {
        if (val !== this.default_model.domain_api_token) {
          this.is_domain_check = true;
          this.changeLabel = 'API Key改变，请确保连接成功再添加';
        }
      }
    }
  },
  methods: {
    afterOpen(form) {
      this.getPool();
      this.$nextTick(async () => {
        this.$refs.Form.clearValidate();
        this.default_model = Object.assign(
          {},
          JSON.parse(JSON.stringify(this.form))
        );
        this.loading = false;
        if (this.options.mode === 'Edit') {
          this.getDetail();
          this.is_domain_check = false;
          this.domain_check_desc = '';
        } else {
          this.is_domain_check = true;
          this.domain_check_desc = '';
        }
      });
    },
    async getPool(
      params = {
        page: 1,
        pool_cate: 1,
        page_size: 99999
      }
    ) {
      this.poolList = [];
      try {
        const data = await this.FetchAccount.get('/pool/list', params);
        const { list = [] } = data || {};
        this.poolList =
          list.map(i => {
            return { label: i.pool_name, value: i.id, ...i };
          }) || [];
      } catch (error) {
        return;
      }
    },
    /**
     *    
     * // const params = {
      //   domain: 'a.app-cdn.info22',
      //   domain_service_name: 'CLOUDFLARE',
      //   domain_email: 'tuhyhliny@gmail.com',
      //   domain_zone_id: 'c86c38624147082665a5e36d769dfa2a-111',
      //   domain_api_token: 'b53a359aae9ed87c48f2d82a8f44e45518a50',
      //   token: 'c5f56d7b9091ba574b39af6b90ec476e'
      // };
     */
    async checkDomain() {
      const params = {
        domain: this.form.domain,
        domain_service_name: this.form.domain_service_name,
        domain_email: this.form.domain_email,
        domain_zone_id: this.form.domain_zone_id,
        domain_api_token: this.form.domain_api_token
      };

      this.loading = true;
      try {
        const { result = '' } = await this.FetchAccount.post(
          '/domain/check',
          params
        );
        this.is_domain_check = false;
        this.domain_check_desc = result;
      } catch (error) {
        console.log(error);
        this.domain_check_desc = error.msg;
        this.is_domain_check = true;
      } finally {
        this.loading = false;
      }
    },

    async getDetail() {
      this.loading = true;
      try {
        const data = await this.FetchAccount.get('/domain/detail', {
          domain_id: this.form.domain_id
        });
        data.app_names =
          (data.app_names &&
            data.app_names.length &&
            data.app_names.join(',')) ||
          ',';
        this.form = Object.assign({ ...this.formDefault }, { ...data });
        this.default_model = JSON.parse(JSON.stringify(this.form));
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
          form.app_names = (form.app_names && form.app_names.split(',')) || [];
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
