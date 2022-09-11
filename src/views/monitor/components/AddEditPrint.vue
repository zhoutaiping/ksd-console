<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="监控节点"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
    >
      <el-form-item prop="name" label="监测点名称">
        <el-input v-model="form.name" class="input-box" />
      </el-form-item>
      <el-form-item prop="ipv4" label="IPV4">
        <el-input v-model="form.ipv4" class="input-box" />
      </el-form-item>
      <el-form-item prop="ipv6" label="IPV6">
        <el-input v-model="form.ipv6" class="input-box" />
      </el-form-item>
      <el-form-item prop="type" label="监测类型">
        <el-select v-model="form.type" class="input-box" placeholder="监测类型" >
          <el-option label="节点" value="ip" />
          <el-option label="源站" value="oomain" />
        </el-select>
      </el-form-item>
      <template v-if="options.mode === 'Edit'">
        <el-form-item prop="loction" label="归属地">
          <el-select v-model="form.loction" class="input-box" placeholder="" >
            <el-option label="上海-上海-上海" value="ip" />
          </el-select>
        </el-form-item>
        <el-form-item prop="isp" label="ISP">
          <el-input v-model="form.isp" class="input-box" placeholder="" />
        </el-form-item>
      </template>
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
import template from "../page/template.vue";
export default createDialog({
  components: { template },
  name: "AddEditPrint",
  data() {
    return {
      formDefault: {
        name: "",
        ipv4: "",
        ipv6: "",
        type: "",
        location: "",
        isp: "",
        remark: "",
      },
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        ipv4: [],
        ipv6: [],
        type: [{ required: true, message: " ", trigger: "blur" }],
        isp: [],
        location: [],
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