<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span> 加入到监控中的监控任务信息 </span>
      <div style="position: absolute; right: 20px; top: 20px">
        <el-button>启用</el-button>
        <el-button>暂停</el-button>
        <!-- <el-button type="primary" @click="$refs.AddEditTaskVue.handleOpen()"
          >添加监控任务</el-button
        > -->
      </div>
    </div>
    <DmToolbar>
      <InputSearch
        v-model="bindParams.app_name"
        :placeholder="'任务目标/ID'"
        class="input-box"
        @submit="handleSearch"
      />
      <div slot="right">
        <el-select
          v-model="bindParams.type"
          :placeholder="'目标状态'"
          @click="handleSearch"
          class="input-box"
        />
        <el-select
          v-model="bindParams.group"
          :placeholder="'监控组'"
          @click="handleSearch"
          class="input-box"
        />
      </div>
    </DmToolbar>
    <DmData ref="DmData" @init="fetchList">
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column type="selection" />
          <el-table-column
            label="监控任务名称/ID"
            prop="app_name"
            min-width="150"
            >
            <template slot-scope="scope">
              <router-link :to="{
                  path:'/monitor/task-dashboard/'+ scope.row.uuid 
              }">
                <span style="font-weight: 700;">{{ scope.row.name }}</span>
              </router-link><br>
              {{ scope.row.uuid }}
            </template>
          </el-table-column>
          <el-table-column label="监控组" prop="group_uuid" min-width="150" />
          <el-table-column label="监控目标" prop="target" min-width="150" />
          <el-table-column label="监控协议" prop="desc" min-width="150" />
          <el-table-column label="监控频率" prop="desc" min-width="150" />
          <el-table-column label="监控目标状态" prop="status" min-width="150" />
          <el-table-column label="延迟" prop="desc" min-width="150" />
          <el-table-column label="可用率" prop="desc" min-width="150" />
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
                  <el-dropdown-item command="eidt">任务详情</el-dropdown-item>
                  <el-dropdown-item command="dashboard">Dashboard</el-dropdown-item>
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
    <AddEditTaskVue ref="AddEditTaskVue" @submit="handleSearch" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from "@/mixins/consoleData";
import InputSearch from "@/components/Input/InputSearch.vue";
import AddEditTaskVue from "../components/AddEditTask.vue";
export default {
  name: "",
  mixins: [consoleData],
  components: { InputSearch, AddEditTaskVue },
  data() {
    return {
      API_INDEX: "/monitor/task/list",
      API_METHOD: "post",
    };
  },
  methods: {
    handleOption(e, data) {
      console.log(e, data);

      if (e === "eidt") {
        this.$refs.AddEditTaskVue.handleOpen(data, {
          mode: "Edit",
        });
      } else if (e === "delte") {
        this.handleDel(data);
      } else if (e === "up" || e === "down") {
        this.editStatus(data);
      } else if(e === 'dashboard') {
        this.$router.push({
          path:'/monitor/task-dashboard/'+ data.id
        })
      }
    },
    editStatus(data) {
      const params = {
        id: data.id,
      };
      console.log(params);

      this.Message("ACTION_SUCCESS");
    },
    async handleDel(data) {
      const params = {
        uuid: data.uuid,
      };
      try {
        await this.Fetch.post('/monitor/task/delete', params)
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