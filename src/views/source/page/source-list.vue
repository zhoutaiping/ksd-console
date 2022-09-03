<template>
  <ConsolePageLayout>
    <DmData ref="DmData"
      @init="fetchList">
      <DmToolbar>
        <el-button type="primary" @click="$refs.addedit.handleOpen()">新增</el-button>
        <div slot="right">
          <InputSearch v-model="bindParams.pool_name" placeholder="资源池名称" @submit="$refs.DmData.initPage()"/>
        </div>
      </DmToolbar>
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list">
          <el-table-column label="ID" prop="id" />
          <el-table-column label="资源池名称/UUID" prop="pool_name" />
          <el-table-column label="类型" prop="LVEL" >
            <template slot-scope="{row}">
              {{type[row.type] || '--' }}
            </template>
          </el-table-column>
          <el-table-column label="是否共享" prop="ISA" >
            <template slot-scope="{row}">
              {{row.unshared ===1 ? '独享': '共享' }}
            </template>
          </el-table-column>
          <el-table-column label="风险等级" prop="LVEL" >
            <template slot-scope="{row}">
              {{risk_level[row.risk_level] || '--' }}
            </template>
          </el-table-column>
          
          <el-table-column label="是否删除" prop="is_delete" >
            <template slot-scope="{row}">
              {{row.is_delete ===1 ? '是': '否' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" />
          <el-table-column label="创建时间" prop="created_at" />
          <el-table-column label="更新时间" prop="updated_at" />
          <el-table-column label="操作" width="140px">
            <template slot-scope="{row}">
              <el-button @click="$refs.addedit.handleOpen(row, 'Edit')">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>

    </DmData>
    <AddEdit ref="addedit" @submit="e =>{$refs.DmData.initPage()}" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DmTable from '@/components/Dm/DmTable.vue'
import AddEdit from './components/add-source.vue'
export default {
  name: 'SourceList',
  components: { DmTable, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      API_INDEX: '/poolList',
      bindParams:{pool_name:''},
      risk_level:{
        1:'低风险',2:'中风险',3:'高风险'
      },
      type:{
        0:' 默认',1:'全局配置',2:'高危风险池'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
