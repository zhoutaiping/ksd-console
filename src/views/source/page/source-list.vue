<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span>管理网关节点</span>
      <div style="position: absolute; right: 20px; top: 20px">
        <el-button type="primary" @click="$refs.addedit.handleOpen()">新增</el-button>
      </div>
    </div>
    <DmData ref="DmData" @init="fetchList" :auto-init="true">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.pool_name"
          placeholder="资源池名称"
          @submit="$refs.DmData.initPage()"
          class="input-box"
        />
        <div slot="right">
          <yd-form-select
            clearable
            :selects="pool_cate_list"
            v-model="bindParams.pool_cate"
            placeholder="资源池类型"
            style="width:130px;margin-right: 10px;"
            @change="$refs.DmData.initPage()"
          />
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column type="index" label="序号" />
          <el-table-column label="资源池名称" prop="pool_name" show-overflow-tooltip>
            <template slot-scope="{row}">
              <a
                class="color--primary"
                @click="handleOption('SERVER', row)"
              >{{row.pool_name || '--' }}</a>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="ISA">
            <template slot-scope="{row}">{{row.unshared ===1 ? '独享': '共享' }}</template>
          </el-table-column>
          <el-table-column label="资源池类型" prop="LVEL">
            <template slot-scope="{row}">{{formartValue(row, 'pool_cate')}}</template>
          </el-table-column>
          <el-table-column label="风险等级" prop="LVEL">
            <template slot-scope="{row}">{{risk_level[row.risk_level] || '--' }}</template>
          </el-table-column>
          <el-table-column label="监控模版" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{formartValue(row, 'monitor_template_name')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="监控组" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{formartValue(row, 'monitor_group_name')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="资源分配" prop="LVEL">
            <template slot-scope="{row}">
              <span>
                共有
                <span class="primary--color">{{row.node_num || 0}}</span>
                个节点
              </span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column label="创建时间" prop="created_at" show-overflow-tooltip>
            <template slot-scope="{row}">{{formartTime(row.created_at)}}</template>
          </el-table-column>
          <el-table-column label="操作" width="80px" fixed="right" align="right">
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
                  <el-dropdown-item command="Edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="SERVER" @click="handleLink(row)">管理节点</el-dropdown-item>
                  <el-dropdown-item command="DEL" @click="del(row)">删除</el-dropdown-item>
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
import AddEdit from '../components/add-source.vue';
export default {
  name: 'SourceList',
  components: { DmTable, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      Fetch: this.FetchAccount,
      API_INDEX: '/pool/list',
      bindParams: { pool_name: '', token: localStorage.getItem('token') },
      risk_level: {
        1: '低风险',
        2: '中风险',
        3: '高风险'
      },
      type: {
        0: ' 默认',
        1: '全局配置',
        2: '高危风险池'
      }
    };
  },
  computed: {
    pool_cate_list() {
      const list = this.$store.getters.pool_cate_list || [];

      return list.map(i => {
        return {
          label: i.key,
          value: i.val
        };
      });
    }
  },
  methods: {
    formartValue(data, prop) {
      let val = data[prop];
      if (prop === 'pool_cate') {
        val = this.pool_cate_list.find(i => Number(i.value) === Number(val));
        val = (val && val.label) || '';
      }
      return val || '';
    },
    handleOption(TYPE, data) {
      if (TYPE === 'Edit') {
        this.$refs.addedit.handleOpen(data, { mode: 'Edit' });
      } else if (TYPE === 'SERVER') {
        this.handleLink(data);
      } else if (TYPE === 'DEL') {
        this.del(data);
      }
    },
    handleLink(data) {
      this.$router.push({
        path: '/source/source-list/' + data.id,
        query: {
          pool_cate: data.pool_cate
        }
      });
    },
    async del(data) {
      if (!data.id) return;
      try {
        await this.Fetch.post('/pool/delete', {
          id: data.id,
          token: localStorage.getItem('token')
        });
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
.input-box {
  width: 200px;
}
</style>
