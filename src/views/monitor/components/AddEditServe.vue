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
      <el-form-item prop="node_uuid" label="监控节点">
        <el-select v-model="form.node_uuid" class="input-box" multiple filterable>
          <el-option v-for="item in nodeList" :key="item.uuid" :label="item.name" :value="item.uuid"/>
        </el-select>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from "@/utils/createDialog";
import { throwStatement } from "@babel/types";
import template from "../page/template.vue";
export default createDialog({
  components: { template },
  name: "AddEditServe",
  data() {
    return {
      formDefault: {
        node_uuid: [],
        group_uuid: this.$route.params.id
      },
      rules: {
        node_uuid: [{ required: true, message: " ", trigger: "blur" }],
        remark: [],
      },
      nodeList:[]
    };
  },
  methods: {
    beforeOpen(form) {
      this.getNodeList()
    },
    async getNodeList(params={page:1, page_size:20}) {
      try {
        const data = await this.Fetch.post('/monitor/node/list', params)
        this.nodeList = data.list
      } catch (error) {
        return
      }
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate((valid) => {
        if (!valid) throw new Error();
      });

      form = {
        ...this.form,
      };
      try {
        if (this.options.mode === "Create") {
          await this.Fetch.post("/monitor/group/add_node", form);
        } else {
          // await this.Fetch.post("/modify", form);
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