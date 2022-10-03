<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span> 网关和源站可用性监控点维护管理 </span>
      <div style="position: absolute; right: 20px; top: 20px">
        <el-button @click="$refs.AddEditGroup.handleOpen({}, {mode:'Create'})" type="primary"
          >添加监控组</el-button
        >
      </div>
    </div>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.name"
        :placeholder="'组名称'"
        class="input-box"
        @submit="handleSearch"
      />
      <div slot="right">
        <!-- <el-select v-model="bindParams.type" :placeholder="'使用状态'" class="input-box"/> -->
      </div>
    </DmToolbar>
    <DmData ref="DmData" @init="fetchList">
      <DmTable :loading="loading" min-height>
        <el-table
          :data="list"
        >
          <el-table-column type="selection" />
          <el-table-column label="组名称/ID" prop="name" min-width="150">
            <template slot-scope="scope">
              <router-link :to="{
                  path:'/monitor/monitor-group/'+ scope.row.uuid 
              }">
                <span style="font-weight: 700;">{{ scope.row.name }}</span>
              </router-link><br>
              {{ scope.row.uuid }}
            </template>
          </el-table-column>
          <el-table-column label="添加时间" prop="created_at" min-width="150" />
          <el-table-column label="备注" prop="remark" min-width="150" />
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
                  <el-dropdown-item command="serve"
                    >监控点管理</el-dropdown-item
                  >
                  <el-dropdown-item command="delte">
                    <span style="color: red">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEditGroup ref="AddEditGroup" @submit="handleSearch" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from "@/mixins/consoleData";
import InputSearch from "@/components/Input/InputSearch.vue";
import AddEditGroup from "../components/AddEditGroup.vue";
import Template from "./template.vue";
export default {
  name: "",
  mixins: [consoleData],
  components: { InputSearch, AddEditGroup },
  data() {
    return {
      API_INDEX: "/monitor/group/list",
      API_METHOD: "post",
    };
  },
  methods: {
    handleOption(e, data) {
      console.log(e, data);

      if (e === "eidt") {
        this.$refs.AddEditGroup.handleOpen(data, {
          mode: "Edit",
        });
      } else if (e === "delte") {
        this.handleDel(data);
      } else if (e === "serve") {
        this.$router.push({
          path: "/monitor/monitor-group/" + data.uuid,
        });
      }
    },

    async handleDel(data) {
      const params = {
        uuid: data.uuid,
      };
      try {
        await this.Fetch.post('/monitor/group/delete', params)
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