<template>
  <ConsolePageLayout>
    <DmData>
      <DmToolbar>
        <el-button type="primary" @click="$refs.addedit.handleOpen()">新增</el-button>
        <div slot="right">
          <InputSearch />
        </div>
      </DmToolbar>
      <DmTable min-height>
        <el-table :data="list">
          <el-table-column label="ID" prop="ID" />
          <el-table-column label="资源池名称/UUID" prop="NAME" />
          <el-table-column label="是否共享" prop="ISA" />
          <el-table-column label="风险等级" prop="LVEL" />
          <el-table-column label="资源分配" prop="SOUCRCE" />
          <el-table-column label="备注" prop="REMARK" />
          <el-table-column label="创建时间" prop="CREATEAT" />
          <el-table-column label="操作" width="140px">
            <template slot-scope="{row}">
              <el-button @click="$refs.addedit.handleOpen(row, 'Edit')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>

    </DmData>
    <AddEdit ref="addedit" @submit="e =>{}" />
  </ConsolePageLayout>
</template>

<script>
import DmTable from '@/components/Dm/DmTable.vue'
import AddEdit from './components/add-source.vue'
export default {
  name: 'SourceList',
  components: { DmTable, AddEdit },
  data() {
    return {
      list: [
        { ID: '22' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
