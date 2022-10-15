<template>
  <DmDialog
    ref="Dialog"
    :fetch-submit="fetchSubmit"
    :mode="options.mode"
    width="700px"
    title-label="监控节点"
    @submit="handleSubmit"
  >
    <el-form ref="Form" :model="form" :rules="rules" label-position="right" label-width="150px">
      <el-form-item prop="node_uuid" label="监控节点">
        <el-select v-model="form.node_uuid" class="input-box" multiple filterable>
          <el-option
            v-for="item in nodeList"
            :key="item.uuid"
            :label="item.name"
            :value="item.uuid"
          >
            {{item.ipv4}}-
            {{item.name}}-
            {{formartValue(item, 'location')}}
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog';
import { areaView } from '@/utils/filter';

export default createDialog({
  name: 'AddEditServe',
  data() {
    return {
      areaView,
      formDefault: {
        node_uuid: [],
        group_uuid: this.$route.params.id
      },
      rules: {
        node_uuid: [{ required: true, message: ' ', trigger: 'blur' }],
        remark: []
      },
      nodeList: []
    };
  },
  methods: {
    formartValue(data, prop) {
      if (prop === 'location') {
        let location = [];
        if (!!data[prop]) {
          location = (!!data[prop] && data[prop].split(',')) || [];
        }
        if (!location.length) {
          if (data.country) location.push(data.country);
          if (data.province) location.push(data.province);
        }
        return (location.length && this.areaView(location)) || '--';
      }
    },
    beforeOpen(form) {
      this.getNodeList();
    },
    async getNodeList(
      params = { page: 1, page_size: 20, token: localStorage.getItem('token') }
    ) {
      try {
        const data = await this.Fetch.post('/monitor/node/list', params);
        this.nodeList = data.list;
      } catch (error) {
        return;
      }
    },
    async fetchSubmit(form) {
      this.$refs.Form.validate(valid => {
        if (!valid) throw new Error();
      });

      form = {
        ...this.form,
        token: localStorage.getItem('token')
      };
      try {
        if (this.options.mode === 'Create') {
          await this.Fetch.post('/monitor/group/add_node', form);
        } else {
          // await this.Fetch.post("/modify", form);
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
.input-box {
  width: 400px;
  /deep/ .el-input__inner {
    text-align: left;
  }
}
</style>