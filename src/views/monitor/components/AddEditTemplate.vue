<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="监控模板"
    @submit="handleSubmit"
  >
    <div class="center-box">
      <yd-scroll ref="scroll">
        <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
          <el-form-item prop="name" label="模板名称">
            <el-input v-model="form.name" clearable class="input-box" />
          </el-form-item>
          <el-form-item prop="protocol" label="适用协议">
            <el-select
              v-model="form.protocol"
              class="input-box"
              @change="e => {
            if(e === 'http'|| e === 'HTTP') {
              form.port = 80
            }else if(e === 'https' || e === 'HTTPS') {
              form.port = 443
            }else {
              form.port = 61081
            }
          }"
            >
              <el-option value="http" label="HTTP" />
              <el-option value="https" label="HTTPS" />
              <el-option value="tcp" label="TCP" />
            </el-select>
          </el-form-item>
          <el-form-item prop="port" label="监控端口">
            <el-input-number
              :controls="false"
              v-model="form.port"
              :precision="0"
              class="input-box"
            />
          </el-form-item>
          <template v-if="!['tcp','TCP'].includes(form.protocol)">
            <el-form-item prop="method" label="监控请求方法">
              <el-select v-model="form.method" class="input-box">
                <el-option value="get" label="GET" />
                <el-option value="post" label="POST" />
                <el-option value="put" label="PUT" />
                <el-option value="delete" label="DELETE" />
              </el-select>
            </el-form-item>
            <el-form-item prop="domain" label="监控host">
              <el-input v-model="form.domain" clearable class="input-box" />
            </el-form-item>
            <el-form-item prop="path" label="监控路径">
              <el-input v-model="form.path" clearable class="input-box" />
            </el-form-item>
          </template>
          <el-form-item prop="frequency" label="监控频率">
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="form.frequency"
              class="input-box"
            />秒
          </el-form-item>
          <el-form-item
            v-if="!['tcp','TCP'].includes(form.protocol)"
            prop="expect_status_code"
            label="预期状态码"
          >
            <el-input-number
              :controls="false"
              :precision="0"
              placeholder="200"
              v-model="form.expect_status_code"
              class="input-box"
            />
          </el-form-item>
          <el-form-item prop="limit_max_fails_rate" label="监控失败占比">
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="form.limit_max_fails_rate"
              class="input-box"
              placeholder="10-100"
              :min="10"
              :max="100"
            />%
            <h5>失败监控点个数/总监控点个数 百分比，被监控对象视为不可用（10-100）</h5>
          </el-form-item>
          <el-form-item prop="limit_max_delay" label="监控耗时">
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="form.limit_max_delay"
              class="input-box"
              placeholder="100-10000"
              :min="100"
              :max="10000"
            />毫秒
            <h5>所有监控点监控耗时均达到该值，则视本次监控不可用（100~10000）</h5>
          </el-form-item>
          <el-form-item prop="limit_max_fail" label="连续不可用计数">
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="form.limit_max_fail"
              class="input-box"
              placeholder="2-10"
              :min="2"
              :max="10"
            />次
            <h5>监控连续不可用次数达到该限制，则视监控目标宕机（2~10）</h5>
          </el-form-item>
          <el-form-item prop="limit_max_rise" label="连续可用计数">
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="form.limit_max_rise"
              class="input-box"
              placeholder="1-5"
              :min="1"
              :max="5"
            />次
            <h5>监控连续可用次数达到该限制, 则视监控目标恢复（1-5）</h5>
          </el-form-item>
          <el-form-item prop="limit_max_delay" label="连续宕机限制">
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="form.limit_up_down_interval"
              style="width:150px"
            />秒
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="form.limit_up_down_count"
              style="width:150px"
            />次
            <h5>设定时间周期内up/down状态改变次数达到阈值,则在周期时间内视为任务"down"(即使"up")</h5>
          </el-form-item>
          <el-form-item prop="limit_avg_delay" label="平均延时监控">
            <el-input-number
              :controls="false"
              :precision="0"
              v-model="form.limit_avg_delay"
              :min="50"
              class="input-box"
            />毫秒
            <h5>一次监控如果所有监测点平均延迟达到该值，则视本次监控不可用 (阈值必须大于50ms)</h5>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" placeholder="备注" type="textarea" class="input-box" />
          </el-form-item>
        </el-form>
      </yd-scroll>
    </div>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog';
import RULE from '@/utils/verify';

function portVaildate(rule, value, callback) {
  if (!value) callback(new Error('请填写'));
  value = parseInt(value, 10);
  if (value < 1 || value > 65535) {
    callback(new Error('端口有误1-65535'));
  }
  callback();
}
export default createDialog({
  name: 'AddEditTask',
  data() {
    return {
      formDefault: {
        name: '',
        protocol: 'HTTP',
        port: '80',
        method: '',
        domain: '',
        path: '',
        frequency: 30,
        expect_status_code: 200,
        limit_max_fail: 3,
        limit_max_fails_rate: 60,
        limit_up_down_count: 5,
        limit_up_down_interval: 600,
        limit_max_delay: 5,
        limit_avg_delay: 50,
        limit_max_rise: 2,
        remark: ''
      },
      rules: {
        name: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        protocol: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        method: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        domain: [],
        port: {
          required: true,
          validator: portVaildate,
          trigger: ['blur', 'change']
        },
        path: [{ required: true, message: ' ', trigger: ['blur', 'change'] }],
        is_default: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        frequency: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        expect_status_code: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        limit_max_fail: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        limit_max_fails_rate: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        limit_up_down_count: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        limit_up_down_interval: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        down_time: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        limit_max_delay: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        limit_max_rise: [
          { required: true, message: ' ', trigger: ['blur', 'change'] }
        ],
        limit_avg_delay: [],
        remark: []
      }
    };
  },
  methods: {
    afterOpen(form) {
      this.$nextTick(async () => {
        this.$refs.Form && this.$refs.Form.clearValidate();
        this.form = Object.assign({ ...this.formDefault }, { ...form });
      });
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error();
      });

      form = {
        ...this.form,
        token: localStorage.getItem('token'),
        limit_max_fails_rate: this.form.limit_max_fails_rate * 0.01
      };
      try {
        if (this.options.mode === 'Create') {
          await this.FetchAccount.post('/monitor/template/add', form);
        } else {
          await this.FetchAccount.post('/monitor/template/edit', form);
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
.center-box {
  max-height: 600px;
  overflow-y: auto;
  display: flex;
  position: relative;
}
.input-box {
  width: 400px;
  /deep/ .el-input__inner {
    text-align: left;
  }
}
</style>