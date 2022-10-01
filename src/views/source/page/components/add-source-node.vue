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
        prop="ip"
        label="IP"
      >
        <el-input
          v-model="form.ip"
          type="textarea"
          placeholder="ip"
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
      formDefault:{
        "risk_level": 1,
        "ip": "",
      },
      rules: {
        risk_level: [
          { required: true, message: '请选择风险等级', trigger: 'blur' },
        ],
        ip: [
          {
            required: true, message: '请输入IP', trigger: 'blur'
          }
        ]
      }
    }
  },

  methods: {
    afterOpen(form) {
      this.$nextTick(async() => {
        this.$refs.Form.clearValidate()
        this.loading = false
        if(this.options.mode ==='Edit') {
          this.getDetail()
        }
      })
    },
    async getDetail() {
      try {
        const data = await this.Fetch.get('/poolNodeDetail', {id:this.form.id})
        console.log(data)
      } catch (error) {
        return
      }
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
          await this.Fetch.post('/poolNodeAdd', form)
        } else {
          await this.Fetch.post('/poolNodeModify', form)
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
