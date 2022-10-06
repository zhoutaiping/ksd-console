<template>
  <ConsolePageLayout>
    <DmData ref="DmData" @init="fetchList">
      <DmToolbar>
        <el-button type="primary" @click="handleOption('add')">新增</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('on')">启用</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('off')">禁用</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('del')">删除</el-button>
        <div slot="right">
          <el-select
            v-model="bindParams.is_delete"
            clearable
            placeholder="删除状态"
            style="width:120px;margin-right: 10px;"
            @change="$refs.DmData.initPage()"
          >
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-select
            v-model="bindParams.status"
            clearable
            placeholder="启用状态"
            style="width:120px;margin-right: 10px;"
            @change="$refs.DmData.initPage()"
          >
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
          <InputSearch
            v-model="bindParams.ip"
            placeholder="ip"
            @submit="$refs.DmData.initPage()"
            style="width:180px;"
          />
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" />
          <el-table-column label="节点IP" prop="id">
            <template slot-scope="{row}">
              {{row.ip || '--' }}
              <!-- <br/>
              {{row.id || '--' }}-->
            </template>
          </el-table-column>
          <el-table-column label="ISP" prop="isp" />
          <el-table-column label="归属地" prop="location" />
          <el-table-column label="风险等级">
            <template slot-scope="{row}">{{ip_pool[row.ip_pool] || '--'}}</template>
          </el-table-column>
          <el-table-column label="独享类型">
            <template slot-scope="{row}">{{Number(row.unshared) === 1 ? '独享': '共享' }}</template>
          </el-table-column>
          <el-table-column label="监控状态" />
          <el-table-column label="使用状态" prop="status">
            <template slot-scope="{row}">{{row.status ===1 ? '启用': '禁用' }}</template>
          </el-table-column>
          <el-table-column label="机器配置" prop="server_config" />
          <el-table-column label="操作" width="200" align="right">
            <template slot-scope="{row}">
              <el-button type="text" @click="handleOption('edit', row)">编辑</el-button>
              <el-divider direction="vertical" />
              <el-button type="text" @click="handleOption('del', row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEdit ref="addedit" @submit="e =>{$refs.DmData.initPage()}" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData';
import DmTable from '@/components/Dm/DmTable.vue';
import AddEdit from './components/add-node.vue';
export default {
  name: 'NodeList',
  components: { DmTable, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      Fetch: this.FetchAccount,
      API_INDEX: '/poolNodeList',
      ip_pool: {
        0: '风险池',
        1: '普通池',
        2: '良好池'
      },
      status: {
        0: ' 禁用',
        1: '启用'
      }
    };
  },
  methods: {
    handleOption(option, data) {
      console.log(this.multipleSelection);
      if (option === 'add') {
        this.$refs.addedit.handleOpen();
        //
      } else if (option === 'edit') {
        this.$refs.addedit.handleOpen(data, { mode: 'Edit' });
        //
      } else if (option === 'del') {
        this.del(data);
      } else if (option === 'on') {
        //
      } else if (option === 'off') {
        //
      }
    },

    async del(data) {
      if (!data.id) return;
      try {
        await this.Fetch.post('/poolNodeDelete', { id: data.id });
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

<style lang="scss" scoped>
</style>
