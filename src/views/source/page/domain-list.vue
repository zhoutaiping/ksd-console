<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span>SDK内置调度域名资源管理</span>

      <div style="position: absolute; right: 20px; top: 20px">
        <el-button :disabled="!multipleSelection.length" @click="handleOption('on')">启用</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('off')">禁用</el-button>
        <el-button type="primary" @click="handleOption('add')">新增</el-button>
      </div>
    </div>
    <DmData ref="DmData" @init="fetchList">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.domain"
          placeholder="域名"
          @submit="$refs.DmData.initPage()"
          style="width:180px;"
        />
        <div slot="right">
          <el-select
            v-model="bindParams.type"
            clearable
            placeholder="是否分配"
            style="width:120px;margin-right: 10px;"
            @change="$refs.DmData.initPage()"
          >
            <!-- <el-option
                v-for="(item, index) in Object.keys(ip_type)"
                :key="index"
                :value="item"
                :label="ip_type[item]"
            />-->
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
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" />
          <el-table-column label="域名/ID" prop="id">
            <template slot-scope="{row}">
              {{row.domain || '--' }}
              <br />
              {{row.domain_id}}
            </template>
          </el-table-column>
          <el-table-column label="域名注册商">
            <template slot-scope="{row}">{{ formartValue(row, 'domain_register_name') }}</template>
          </el-table-column>
          <el-table-column label="域名解析商">
            <template slot-scope="{row}">{{formartValue(row, 'domain_service_name')}}</template>
          </el-table-column>
          <el-table-column label="解析地址">
            <template slot-scope="{row}">{{row.ip || '--'}}</template>
          </el-table-column>
          <el-table-column label="使用状态" prop="status">
            <template slot-scope="{row}">
              <span v-if="row.status === 1" class="success--color">启用</span>
              <span v-if="row.status === 0" class="red--color">禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="解析地址修改时间">
            <template slot-scope="{row}">{{formartTime(row.updated_at)}}</template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column label="操作" width="200" align="right">
            <template slot-scope="{row}">
              <el-dropdown
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
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="log">宕机切换日志</el-dropdown-item>
                  <el-dropdown-item command="del">
                    <span style="color:red;">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
import AddEdit from '../components/add-domain.vue';
export default {
  name: 'NodeList',
  components: { DmTable, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      Fetch: this.FetchAccount,
      API_INDEX: '/domain/list',

      bindParams: {},
      status: {
        0: ' 禁用',
        1: '启用'
      }
    };
  },
  methods: {
    formartValue(data, prop) {
      return data[prop];
    },
    handleOption(option, data) {
      if (option === 'add') {
        this.$refs.addedit.handleOpen();
      } else if (option === 'edit') {
        this.$refs.addedit.handleOpen(data, { mode: 'Edit' });
      } else if (option === 'log') {
        this.$router.push({
          path: '/source/domian-list/' + data.domain_id,
          query: {
            domain: data.domain
          }
        });
      } else if (option === 'del') {
        this.del(data);
      } else if (option === 'on') {
        const params = {
          domain_ids: this.multipleSelection.map(i => i.domain_id),
          status: 1
        };
        this.editStatus(params);
      } else if (option === 'off') {
        const params = {
          domain_ids: this.multipleSelection.map(i => i.domain_id),
          status: 0
        };
        this.editStatus(params);
      }
    },
    async editStatus(params) {
      try {
        await this.Fetch.post('/domain/statusSet', params);
        await this.$refs.DmData.initPage();
        this.Message('ACTION_SUCCESS');
      } catch (error) {
        // this.Message('ACTION_ERROR');
        return;
      }
    },
    async del(data) {
      if (!data.domain_id) return;
      try {
        await this.Fetch.post('/domain/delete', {
          domain_id: Number(data.domain_id)
        });
        await this.$refs.DmData.initPage();
        this.Message('ACTION_SUCCESS');
      } catch (error) {
        // this.Message('ACTION_ERROR');
        return;
      }
    }
  }
};
</script>
  
  <style lang="scss" scoped>
</style>
  