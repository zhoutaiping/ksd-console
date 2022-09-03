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
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
    >
      <el-form-item
        prop="pool_name"
        label="资源池名称"
      >
        <el-input
          v-model="form.pool_name"
          class="input-box"
        />
      </el-form-item>
      <el-form-item
        prop="type"
        label="类型"
      >
        <el-select
          v-model="form.type"
          class="input-box"
        >
          <el-option :value="0" label="默认"></el-option>
          <el-option :value="1" label="全家配置"></el-option>
          <el-option :value="2" label="高风险池"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="risk_level"
        label="风险等级"
      >
        <el-select
          v-model="form.risk_level"
          class="input-box"
        >
          <el-option :value="1" label="低"></el-option>
          <el-option :value="2" label="中"></el-option>
          <el-option :value="3" label="高"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="unshared"
        label="是否独享"
      >
        <el-checkbox
          v-model="form.unshared"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>
      <el-form-item
        prop="is_delete"
        label="是否删除"
      >
        <el-checkbox
          v-model="form.is_delete"
          :true-label="1"
          :false-label="0"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          placeholder="备注"
          type="textarea"
          class="input-box"
        />
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'

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
}

function portValidator(rule, value, callback) {
  value = value.toString().replace('，', ',')
  value = value.toString().split(',')
  if (value.length > 1000) callback(new Error('最多同时添加1000个端口'))
  callback()
}

export default createDialog({
  components: { },

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
        "is_delete": 0,
        "pool_name": "",
        "pool_uuid": "",
        "remark": "",
        "risk_level": 1,
        "type": 0,
        "unshared": 0
      },
      rules: {
        port: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          { validator: portValidator, trigger: 'blur' }
        ],
        domain: [
          {

          }
        ]
      },
      mode: 'Created'
    }
  },

  methods: {
    afterOpen(form) {
      this.$nextTick(async() => {
        this.$refs.Form.clearValidate()
        this.loading = false
      })
    },

    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error()
      })

      form = {
        ...this.form
      }

      try {
        if (this.options.mode === 'Create') {
          await this.Fetch.post('/pooolAdd', form)
        } else {
          await this.Fetch.post('/pooolNodify', form)
        }
      } catch (e) {
        throw new Error()
      }
    },

    async handleSubmit() {
      this.Message('ACTION_SUCCESS')
      this.$emit('submit')
      this.handleClose()
    }
  }
})
</script>
