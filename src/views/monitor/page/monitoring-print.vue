<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px;">
        <span>
            网关和源站可用性监控点维护管理
        </span>
        <div style="position: absolute;right: 20px;top: 20px;">
            <el-button @click="$refs.AddEditPrint.handleOpen()" type="primary">添加监控点</el-button>
        </div>
    </div>
    <DmToolbar>
        <InputSearch v-model="bindParams.app_name" :placeholder="'任务IP'" class="input-box" @submit="handleSearch"/>
        <div slot="right">
            <el-select v-model="bindParams.type" :placeholder="'使用状态'" class="input-box" @change="handleSearch"/>
        </div>    
        
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
    <DmTable
        :loading="loading"
        min-height
      >
      <el-table :data="[
        {
          app_name:'新加坡地区',
          id: 5562
        }
      ]">
        <el-table-column type="selection" /> 
        <el-table-column
            label="监控点名称/ID"
            prop="app_name"
            min-width="150"
          />
          <el-table-column
            label="监控点类型"
            prop="name"
            min-width="150"
          />
          <el-table-column
            label="IPV4/IPV6"
            prop="desc"
            min-width="150"
          />
          
          <el-table-column
            label="IP/归属地"
            prop="status"
            min-width="150"
          />
          <el-table-column
            label="添加时间"
            prop="desc"
            min-width="150"
          />
          <el-table-column label="操作" fixed="right" width="150" align="right">
            <template slot-scope="{ row }">
              <el-dropdown
                type="primary"
                @command="
                  (e) => {
                    handleOption(e, row);
                  }
                "
              >
                <span class="el-dropdown-link"> 
                  <i class="el-icon-more" />  
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="eidt">编辑</el-dropdown-item>
                  <el-dropdown-item command="delte">
                    <span style="color:red;">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEditPrint ref="AddEditPrint" @submit="handleSearch"/>
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import InputSearch from '@/components/Input/InputSearch.vue';
import AddEditPrint from '../components/AddEditPrint.vue';
export default {
    name:'',
    mixins:[consoleData],
    components:{ InputSearch, AddEditPrint },
    data() {
        return {
            API_INDEX: ''
        }
    },
    methods:{
      handleOption(e, data) {
      console.log(e, data);

      if(e === 'eidt') {
        this.$refs.AddEditPrint.handleOpen(data, {
          mode:'Edit'
        })
      } else if(e === 'delte') {
        this.handleDel(data)
      }
    },

    handleDel(data) {
      const params = {
        id: data.id
      }
      console.log(params)

      this.Message("ACTION_SUCCESS");
    }
  }
}
</script>

<style lang="scss" scoped>
.input-box {
    width: 200px;
    margin-right: 5px;
}
</style>>