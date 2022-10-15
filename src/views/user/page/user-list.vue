<template>
  <ConsolePageLayout style="padding:12px;">
    <div slot="header" style="margin-bottom: 10px">
      <span>管理员平台账号管理，非租户账号</span>
      <div style="position: absolute; right: 20px; top: 20px">
        <el-button :disabled="!multipleSelection.length" @click="editStatus">禁用</el-button>
        <el-button type="primary" @click="$refs.Add.handleOpen({}, {mode:'Create'})">新增</el-button>
        <!-- <el-button type="primary" @click="$refs.AddEditTaskVue.handleOpen()"
            >添加监控任务</el-button
        >-->
      </div>
    </div>
    <DmData ref="DmData" @init="fetchList">
      <DmToolbar>
        <!-- <el-button type="primary" @click="$refs.Add.handleOpen()">新增应用</el-button> -->
        <InputSearch
          v-model="bindParams.name"
          placeholder="用户名称"
          @submit="handleSearch"
          style="width:200px"
        />
        <!-- <el-button @click="handleSearch">刷新</el-button> -->
        <!-- <el-button :disabled="!multipleSelection.length" @click="">删除</el-button>-->
        <div slot="right">
          <el-select v-model="bindParams.status" placeholder="状态" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list" @selection-change="handleSelectionChange">
          <el-table-column label="序号" type="index" width="55" />
          <el-table-column label="用户名" min-width="150">
            <template slot-scope="{ row }">{{row.name || '--'}}</template>
          </el-table-column>
          <el-table-column label="昵称" min-width="150">
            <template slot-scope="{ row }">{{row.nick_name || '--'}}</template>
          </el-table-column>
          <el-table-column label="角色" min-width="150">
            <template slot-scope="{ row }">{{row.role_name || '--'}}</template>
          </el-table-column>
          <el-table-column label="状态" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.status ===1 " class="success--color">启用</span>
              <span v-else class="red--color">禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" />
          <el-table-column label="操作" width="200" align="right">
            <template slot-scope="{row}">
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
                  <el-dropdown-item command="password">重置密码</el-dropdown-item>
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
    <Add ref="Add" @submit="handleSearch" />
    <Passord ref="password" @submit="handleSearch" />
  </ConsolePageLayout>
</template>
  
  <script>
import consoleData from '@/mixins/consoleData';
import Add from '../components/add-edit-user.vue';
import Passord from '../components/reset-password.vue';
export default {
  components: { Add, Passord },

  mixins: [consoleData],

  data() {
    return {
      Fetch: this.FetchAccount,
      API_INDEX: '',
      bindParams: {
        token: localStorage.getItem('token')
      }
    };
  },

  methods: {
    handleOption(key, data) {
      if (key === 'delte') this.del(data);
      if (key === 'edit') {
        console.log(data);
        this.$refs.Add.handleOpen({ ...data }, { mode: 'Edit' });
      }
      if (key === 'password') {
        this.$refs.password.handleOpen({ ...data }, { mode: 'Edit' });
      }
    },
    async editStatus() {
      try {
        await this.Fetch.post('/user/status', {
          ids: this.multipleSelection.map(i => i.id),
          status: 0,
          token: localStorage.getItem('token')
        });
        await this.$refs.DmData.initPage();
        this.Message('ACTION_SUCCESS');
      } catch (error) {
        return;
      }
    },
    async del(data) {
      if (!data.id) return;
      try {
        await this.Fetch.post('/user/delete', { id: data.id });
        await this.$refs.DmData.initPage();
        this.Message('ACTION_SUCCESS');
      } catch (error) {
        this.Message('ACTION_ERROR');
        return;
      }
    }
  }
};
</script>
  