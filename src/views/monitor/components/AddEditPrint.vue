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
        <el-select v-model="form.type" class="input-box" placeholder="监测类型">
          <el-option label="节点监控" :value="1" />
          <el-option label="源站监控" :value="2" />
        </el-select>
      </el-form-item>
        <el-form-item prop="country" label="国家">
          <el-select
            v-model="form.country"
            class="input-box"
            placeholder=""
            filterable
            allow-create
            default-first-option
          >
          </el-select>
        </el-form-item>
        <el-form-item prop="province" label="省/地区">
          <el-select
            v-model="form.province"
            class="input-box"
            placeholder=""
            filterable
            allow-create
            default-first-option
          >
          </el-select>
        </el-form-item>
        <el-form-item prop="city" label="城市">
          <el-select
            v-model="form.city"
            class="input-box"
            placeholder=""
            filterable
            allow-create
            default-first-option
          >
          </el-select>
        </el-form-item>
        <el-form-item prop="isp" label="线路">
          <el-input v-model="form.isp" class="input-box" placeholder="" />
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
  name: "AddEditPrint",
  data() {
    return {
      formDefault: {
        name: "",
        ipv4: "",
        ipv6: "",
        type: "",
        country: "",
        province: "",
        city: "",
        isp: "",
        remark: "",
        status: 0,
      },
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        ipv4: [{ required: true, message: " ", trigger: "blur" }],
        ipv6: [],
        type: [{ required: true, message: " ", trigger: "blur" }],
        isp: [],
        country: [],
        province: [],
        city: [],
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
      console.log();
      try {
        if (this.options.mode === "Create") {
          await this.Fetch.post("/monitor/node/add", form);
        } else {
          await this.Fetch.post("/monitor/node/edit", form);
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