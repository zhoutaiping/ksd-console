<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span> 配置监控模板，监控任务只能引入监控模板 </span>
      <div style="position: absolute; right: 20px; top: 20px">
        <el-button type="primary" @click="$refs.AddEditTemplate.handleOpen({}, {mode:'Create'})"
          >添加监控模板</el-button
        >
      </div>
    </div>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.app_name"
        :placeholder="'名称'"
        class="input-box"
        @submit="handleSearch"
      />
      <div slot="right">
        <el-select
          v-model="bindParams.type"
          :placeholder="'监控协议'"
          class="input-box"
          @change="handleSearch"
        />
        <el-select
          v-model="bindParams.group"
          :placeholder="'监控组'"
          class="input-box"
          @change="handleSearch"
        />
      </div>
    </DmToolbar>
    <DmData ref="DmData" @init="fetchList">
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column type="selection" />
          <el-table-column label="模板名称/ID" prop="name" min-width="150" >
            <template slot-scope="{row}">
              <span>{{row.name}}</span><br/>
              <span>{{row.uuid}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="监控组" prop="group_name" min-width="150" /> -->
          <el-table-column label="适用协议" prop="protocol" min-width="150" />
          <el-table-column label="监控频率" prop="frequency" min-width="150" >
            <template slot-scope="{row}">
              <span>{{row.frequency}} s</span>
            </template>
          </el-table-column>
          <el-table-column label="监控耗时" prop="limit_max_delay" min-width="150" >
            <template slot-scope="{row}">
              <span>{{row.limit_max_delay}} ms</span>
            </template>
          </el-table-column>
          <el-table-column
            label="连续不可以用计数"
            prop="limit_max_fail"
            min-width="150"
          />
          <el-table-column label="添加时间" prop="created_at" min-width="150" />
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
    <AddEditTemplate ref="AddEditTemplate" @submit="handleSearch" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from "@/mixins/consoleData";
import InputSearch from "@/components/Input/InputSearch.vue";
import AddEditTemplate from "../components/AddEditTemplate.vue";

export default {
  name: "",
  mixins: [consoleData],
  components: { InputSearch, AddEditTemplate },
  data() {
    return {
      API_INDEX: "/monitor/template/list",
      API_METHOD: "post"
    };
  },
  methods: {
    handleOption(e, data) {
      console.log(e, data);

      if(e === 'eidt') {
        this.$refs.AddEditTemplate.handleOpen(data, {
          mode:'Edit'
        })
      } else if(e === 'delte') {
        this.handleDel(data)
      }
    },

    async handleDel(data) {
      const params = {
        uuid: data.uuid,
      };
      try {
        await this.Fetch.post('/monitor/template/delete', params)
        this.Message("ACTION_SUCCESS");
        this.handleSearch()
      } catch (error) {
        return
      }

    },
  },
};
</script>

<style lang="scss" scoped>
.input-box {
  width: 200px;
  margin-right: 5px;
}
</style>>