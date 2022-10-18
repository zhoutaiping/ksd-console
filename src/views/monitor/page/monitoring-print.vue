<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span>网关和源站可用性监控点维护管理</span>
      <div style="position: absolute; right: 20px; top: 20px">
        <el-button @click="$refs.AddEditPrint.handleOpen({}, {mode:'Create'})" type="primary">添加监控点</el-button>
      </div>
    </div>
    <DmData ref="DmData" @init="fetchList">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.name"
          :placeholder="'搜索名称/IP'"
          class="input-box"
          @submit="handleSearch"
        />
        <div slot="right">
          <!-- <el-select
            v-model="bindParams.type"
            :placeholder="'使用状态'"
            class="input-box"
            @change="handleSearch"
          />-->
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column type="selection" />
          <el-table-column label="监控点名称/ID" prop="app_name" min-width="150">
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
              <br />
              <span>{{ row.uuid }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="监控点类型" prop="type" min-width="150">
            <template slot-scope="{ row }">
              <span>{{ type[row.type] || '--' }}</span>
            </template>
          </el-table-column>-->
          <el-table-column label="IPV4/IPV6" prop="desc" min-width="150">
            <template slot-scope="{ row }">
              <span>{{ row.ipv4 }}</span>
              <br />
              <span>{{ row.ipv6 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="归属地/ISP" prop="status" min-width="150">
            <template slot-scope="{ row }">
              <span>{{ formartValue(row, 'location')}}</span>
              <br />
              <span>{{ formartValue(row, 'isp') }}</span>
            </template>
          </el-table-column>
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
                    <span style="color: red">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEditPrint ref="AddEditPrint" @submit="handleSearch" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData';
import InputSearch from '@/components/Input/InputSearch.vue';
import AddEditPrint from '../components/AddEditPrint.vue';
import { areaView } from '@/utils/filter';
import ISP from '@/constants/isp';

export default {
  name: '',
  mixins: [consoleData],
  components: { InputSearch, AddEditPrint },
  data() {
    return {
      areaView,
      API_INDEX: '/monitor/node/list',
      API_METHOD: 'post',
      Fetch: this.FetchAccount,
      bindParams: {
        token: localStorage.getItem('token')
      },
      ISP,
      type: {
        1: '节点监控',
        2: '源站监控'
      }
    };
  },
  methods: {
    formartValue(data, prop) {
      if (prop === 'location') {
        let location = (data.location && data.location.splic(',')) || [];
        if (!location.length) {
          if (data.country) location.push(data.country);
          if (data.province) location.push(data.province);
        }
        return (location.length && this.areaView(location)) || '--';
      }
      if (prop === 'isp') {
        const find = this.ISP.find(i => i.value === data[prop]);
        return find ? find.label : '--';
      }
    },
    handleOption(e, data) {
      if (e === 'eidt') {
        this.$refs.AddEditPrint.handleOpen(
          { ...data },
          {
            mode: 'Edit'
          }
        );
      } else if (e === 'delte') {
        this.handleDel(data);
      }
    },

    async handleDel(data) {
      const params = {
        token: localStorage.getItem('token'),
        uuid: data.uuid
      };
      try {
        await this.FetchAccount.post('/monitor/node/delete', params);
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