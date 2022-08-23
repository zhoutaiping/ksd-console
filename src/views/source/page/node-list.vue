<template>
  <ConsolePageLayout>
    <DmData>
      <DmToolbar>
        <el-button type="primary" @click="handleOption('add')">新增</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('on')">启用</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('off')">禁用</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('del')">删除</el-button>
        <div slot="right">
          <InputSearch />
        </div>
      </DmToolbar>
      <DmTable min-height>
        <el-table :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" />
          <el-table-column label="ID" prop="ID" />
          <el-table-column label="Node" prop="Node" />
          <el-table-column label="ISP" prop="ISP" />
          <el-table-column label="Country" prop="Country" />
          <el-table-column label="address" prop="SOUCRCE" />
          <el-table-column label="Level" prop="REMARK" />
          <el-table-column label="共享类型" prop="REMARK" />
          <el-table-column label="分配状态" prop="REMARK" />
          <el-table-column label="监控状态" prop="REMARK" />
          <el-table-column label="当前状态" prop="CREATEAT" />
          <el-table-column label="机器配置" prop="CREATEAT" />
        </el-table></DmTable>

    </DmData>
    <AddEdit ref="addedit" @submit="e =>{}" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DmTable from '@/components/Dm/DmTable.vue'
import AddEdit from './components/add-node.vue'
export default {
  name: 'NodeList',
  components: { DmTable, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      list: [
        { ID: '22' }
      ]
    }
  },
  methods: {
    handleOption(option) {
      console.log(this.multipleSelection)
      if (option === 'add') {
        this.$refs.addedit.handleOpen()
        //
      } else if (option === 'del') {
        //
      } else if (option === 'on') {
        //
      } else if (option === 'off') {
        //
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
