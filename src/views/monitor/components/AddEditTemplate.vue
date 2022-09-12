<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="监控模板"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
    >
      <el-form-item prop="name" label="模板名称">
        <el-input v-model="form.name" class="input-box" />
      </el-form-item>
      <!-- <el-form-item prop="group" label="监控点组">
        <el-select v-model="form.group" class="input-box">
          <el-option value="1" label="测试模板" />
          <el-option value="2" label="正式模板" />
        </el-select>
      </el-form-item> -->
      <el-form-item prop="http" label="适用协议">
        <el-select v-model="form.http" class="input-box" @change="e => {
          if(e === 'http') {
            form.port = 80
          }else if(e === 'https') {
            form.port = 443
          }else {
            form.port = 61081
          }
        }">
          <el-option value="http" label="HTTP" />
          <el-option value="https" label="HTTPS" />
          <el-option value="tcp" label="TCP" />
        </el-select>
      </el-form-item>
      <el-form-item prop="port" label="监控端口">
        <el-input-number
          :controls="false"
          v-model="form.port"
          class="input-box"
        />
      </el-form-item>
      <template v-if="form.http!=='tcp'">
        <el-form-item prop="methods" label="监控请求方法">
          <el-select v-model="form.methods" class="input-box">
            <el-option value="get" label="GET" />
            <el-option value="post" label="POST" />
            <el-option value="put" label="PUT" />
            <el-option value="delete" label="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item prop="host" label="监控host">
          <el-input v-model="form.host" class="input-box" />
        </el-form-item>
        <el-form-item prop="url" label="监控路径">
          <el-input v-model="form.url" class="input-box" />
        </el-form-item>
      </template>
      <el-form-item prop="frequency" label="监控频率">
        <el-input-number :controls="false" v-model="form.frequency" class="input-box" /> 秒
      </el-form-item>
      <el-form-item v-if="form.http!=='tcp'" prop="htpt_code" label="预期状态码">
        <el-input-number
          :controls="false"
          placeholder="200"
          v-model="form.htpt_code"
          class="input-box"
        />
      </el-form-item>
      <el-form-item prop="error_ratio" label="监控失败占比">
        <el-input-number
          :controls="false"
          v-model="form.error_ratio"
          class="input-box"
          placeholder="10-100"
          :min="10"
          :max="100"
        /> %
        <h5>
          失败监控点个数/总监控点个数 百分比，被监控对象视为不可用（10-100）
        </h5>
      </el-form-item>
      <el-form-item prop="monitor_time" label="监控耗时">
        <el-input-number
          :controls="false"
          v-model="form.monitor_time"
          class="input-box"
          placeholder="100-10000"
          :min="100"
          :max="10000"
        /> 毫秒
        <h5>
          所有监控点监控耗时均达到该值，则视本次监控不可用（100~10000）
        </h5>
      </el-form-item>
      <el-form-item prop="nouse_count" label="连续不可用计数">
        <el-input-number
          :controls="false"
          v-model="form.nouse_count"
          class="input-box"
          placeholder="2-10"
          :min="2"
          :max="10"
        /> 次
        <h5>
          监控连续不可用次数达到该限制，则视监控目标宕机（2~10）
        </h5>
      </el-form-item>
      <el-form-item prop="use_count" label="连续可用计数">
        <el-input-number
          :controls="false"
          v-model="form.use_count"
          class="input-box"
          placeholder="1-5"
          :min="1"
          :max="5"
        /> 次
        <h5>
          监控连续可用次数达到该限制, 则视监控目标恢复（1-5）
        </h5>
      </el-form-item>
      <el-form-item prop="down_count" label="连续宕机限制">
        <el-input-number
          :controls="false"
          v-model="form.down_time"
          style="width:150px"
        /> 秒
        <el-input-number
          :controls="false"
          v-model="form.down_count"
          style="width:150px"
        /> 次
        <h5>
          设定时间周期内up/down状态改变次数达到阈值,则在周期时间内视为任务"down"(即使"up")
        </h5>
      </el-form-item>
      <el-form-item prop="delayed_time" label="平均可用延时监控">
        <el-input-number
          :controls="false"
          v-model="form.delayed_time"
          class="input-box"
        /> 毫秒
        <h5>
          一次监控如果所有监测点平均延迟达到该值，则视本次监控不可用 (阈值必须大于50ms)
        </h5>
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
import createDialog from "@/utils/createDialog";
export default createDialog({
  name: "AddEditTask",
  data() {
    return {
      formDefault: {
        name: "",
        // group: "",
        http: "http",
        port:'80',
        methods:'',
        host:'',
        url:'',
        frequency: 30,
        htpt_code: "",
        error_ratio: 60,
        monitor_time: 3000,
        nouse_count: 3,
        use_count:2,
        down_time: 600,
        down_count: 5,
        delayed_time: "",
        remark: "",
      },
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        group: [{ required: true, message: " ", trigger: "blur" }],
        http: [{ required: true, message: " ", trigger: "blur" }],
        port: [{ required: true, message: " ", trigger: "blur" }],
        methods: [{ required: true, message: " ", trigger: "blur" }],
        host: [],
        url: [{ required: true, message: " ", trigger: "blur" }],
        is_default: [{ required: true, message: " ", trigger: "blur" }],
        frequency: [{ required: true, message: " ", trigger: "blur" }],
        htpt_code: [{ required: true, message: " ", trigger: "blur" }],
        error_ratio: [{ required: true, message: " ", trigger: "blur" }],
        monitor_time: [{ required: true, message: " ", trigger: "blur" }],
        nouse_count: [{ required: true, message: " ", trigger: "blur" }],
        use_count: [{ required: true, message: " ", trigger: "blur" }],
        down_time: [{ required: true, message: " ", trigger: "blur" }],
        down_count: [{ required: true, message: " ", trigger: "blur" }],
        delayed_time: [{ required: true, message: " ", trigger: "blur" }],
        remark: [],
      },
    };
  },
  methods: {
    async fetchSubmit(form) {
      this.$refs.Form.validate((valid) => {
        if (!valid) throw new Error();
      });

      form = {
        ...this.form,
      };
      try {
        if (this.options.mode === "Create") {
          await this.Fetch.post("/add", form);
        } else {
          await this.Fetch.post("/modify", form);
        }
      } catch (e) {
        throw new Error();
      }
    },

    async handleSubmit() {
      this.Message("ACTION_SUCCESS");
      this.$emit("submit");
      this.handleClose();
    },
  },
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