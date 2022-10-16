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
        <div>
          <InputSearch
            v-model="bindParams.pool_name"
            placeholder="资源池名称"
            @submit="$refs.DmData.initPage()"
            class="input-box"
          />
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column label="资源池名称" prop="pool_name">
            <template slot-scope="{row}">
              {{row.pool_name || '--' }}
              <!-- <br/>
              {{row.id}}-->
            </template>
          </el-table-column>
          <!-- <el-table-column label="类型" prop="LVEL" >
            <template slot-scope="{row}">
              {{type[row.type] || '--' }}
            </template>
          </el-table-column>-->
          <el-table-column label="类型" prop="ISA">
            <template slot-scope="{row}">{{row.unshared ===1 ? '独享': '共享' }}</template>
          </el-table-column>
          <el-table-column label="风险等级" prop="LVEL">
            <template slot-scope="{row}">{{risk_level[row.risk_level] || '--' }}</template>
          </el-table-column>
          <el-table-column label="监控模版" prop>
            <template slot-scope="{row}">
              {{
              formartValue(row, 'template_name')
              }}
            </template>
          </el-table-column>
          <el-table-column label="监控组" prop>
            <template slot-scope="{row}">
              {{
              formartValue(row, 'group_name ')
              }}
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
          <!-- <el-table-column label="是否删除" prop="is_delete" >
            <template slot-scope="{row}">
              {{row.is_delete ===1 ? '是': '否' }}
            </template>
          </el-table-column>-->
          <el-table-column label="备注" prop="remark" />
          <el-table-column label="创建时间" prop="created_at" />
          <!-- <el-table-column label="更新时间" prop="updated_at" /> -->
          <el-table-column label="操作" width="80px">
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
                  <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="Edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="SERVER" @click="handleLink(row)">管理节点</el-dropdown-item>
                  <el-dropdown-item command="DEL" @click="del(row)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- 
              <el-button type="text" @click="$refs.addedit.handleOpen(row, 'Edit')">编辑</el-button>
              <el-button type="text" @click="$refs.addedit.handleOpen(row, 'Edit')">管理节点</el-button>
              <el-button type="text" @click="">删除</el-button>-->
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
import AddEdit from './components/add-source.vue';
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
  methods: {
    formartValue(data, prop) {
      return data[prop] || '';
    },
    handleOption(TYPE, data) {
      if (TYPE === 'Edit') {
        this.$refs.addedit.handleOpen(data, { mode: 'Edit' });
      } else if (TYPE === 'SERVER') {
        this.$router.push({
          path: '/source/source-list/' + data.id
        });
      } else if (TYPE === 'DEL') {
        this.del(data);
      }
    },
    handleLink(data) {
      this.$router.push({
        path: '/source/source-list/' + data.id
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
