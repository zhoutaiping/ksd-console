<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span>加入到监控中的监控任务信息</span>
    </div>
    <DmData ref="DmData" @init="fetchList">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.target"
          :placeholder="'监控目标'"
          class="input-box"
          @submit="handleSearch"
        />
        <div slot="right">
          <el-select
            v-model="bindParams.target_status"
            :placeholder="'目标状态'"
            clearable
            @change="handleSearch"
            style="width: 130px;"
            class="input-box"
          >
            <el-option label="正常" :value="1"></el-option>
            <el-option label="宕机" :value="2"></el-option>
          </el-select>
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column type="index" label="序号" />
          <el-table-column label="监控任务名称/ID" prop="app_name" show-overflow-tooltip min-width="200">
            <template slot-scope="scope">
              <span style="font-weight: 700;">{{ scope.row.name }}</span>
              <br />
              {{ scope.row.uuid }}
            </template>
          </el-table-column>
          <el-table-column label="监控组" prop="group_uuid" min-width="150" show-overflow-tooltip />
          <el-table-column label="监控目标" prop="target" show-overflow-tooltip />
          <el-table-column label="监控协议" prop="protocol" align="center">
            <template slot-scope="{row}">{{formartValue(row, 'protocol') || '--'}}</template>
          </el-table-column>
          <el-table-column label="监控频率" prop="frequency" align="center">
            <template slot-scope="{row}">{{formartValue(row, 'frequency') || 0 }} 秒</template>
          </el-table-column>
          <el-table-column label="监控目标状态" prop="status" align="center">
            <template slot-scope="{row}">
              <span v-if="Number(row.target_status) === 1" class="success--color">正常</span>
              <span v-else-if="Number(row.target_status) === 2" class="warning--color">宕机</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" prop="created_at">
            <template slot-scope="{row}">{{formartTime(row.created_at)}}</template>
          </el-table-column>
          <el-table-column v-if="false" label="操作" fixed="right" width="150" align="right">
            <template slot-scope="{ row }">
              <el-dropdown type="primary" @command="(e) => { handleOption(e, row); }">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
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
import consoleData from '@/mixins/consoleData';
import InputSearch from '@/components/Input/InputSearch.vue';
import AddEditTaskVue from '../components/AddEditTask.vue';
export default {
  name: '',
  mixins: [consoleData],
  components: { InputSearch, AddEditTaskVue },
  data() {
    return {
      API_INDEX: '/monitor/task/list',
      Fetch: this.FetchAccount,
      bindParams: {
        token: localStorage.getItem('token')
      },
      API_METHOD: 'post'
    };
  },
  methods: {
    formartValue(data, prop) {
      if (prop === 'protocol' || prop === 'frequency') {
        const template =
          (this.resData.templates &&
            this.resData.templates.find(i => i.uuid === data.template_uuid)) ||
          null;
        if (template) {
          return template[prop];
        }

        return '';
      }
    },
    handleOption(e, data) {
      if (e === 'eidt') {
        this.$refs.AddEditTaskVue.handleOpen(data, {
          mode: 'Edit'
        });
      } else if (e === 'delte') {
        this.handleDel(data);
      } else if (e === 'up' || e === 'down') {
        this.editStatus(data);
      } else if (e === 'dashboard') {
        this.$router.push({
          path: '/Monitor/task-dashboard/' + data.id
        });
      }
    },
    editStatus(data) {
      const params = {
        id: data.id
      };

      this.Message('ACTION_SUCCESS');
    },
    async handleDel(data) {
      const params = {
        uuid: data.uuid,
        token: localStorage.getItem('token')
      };
      try {
        await this.FetchAccount.post('/monitor/task/delete', params);
        this.Message('ACTION_SUCCESS');
        this.handleSearch();
      } catch (error) {
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.input-box {
  width: 200px;
  margin-right: 5px;
}
</style>>