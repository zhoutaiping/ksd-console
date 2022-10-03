<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="监控组"
    @submit="handleSubmit"
  >
    <el-form
      ref="Form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
    >
      <el-form-item prop="name" label="组名称">
        <el-input v-model="form.name" class="input-box" />
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
import template from "../page/template.vue";
export default createDialog({
  components: { template },
  name: "AddEditGroup",
  data() {
    return {
      formDefault: {
        name: "",
      
        remark: "",
      },
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
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
          await this.Fetch.post("/monitor/group/add", form);
        } else {
          await this.Fetch.post("/monitor/group/edit", form);
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