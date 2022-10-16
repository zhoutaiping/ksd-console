<template>
  <ConsolePageLayout title="节点列表">
    <div slot="header" style="margin-bottom: 10px">
      <span>节点池中网关节点IP管理</span>
      <div style="position: absolute; right: 20px; top: 20px">
        <el-button :disabled="!multipleSelection.length" @click="handleOption('on')">启用</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('off')">禁用</el-button>
        <el-button type="primary" @click="$refs.addedit.handleOpen()">新增</el-button>
      </div>
    </div>
    <DmData ref="DmData" @init="fetchList" :auto-init="true">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.ip"
          placeholder="节点IP"
          @submit="$refs.DmData.initPage()"
          class="input-box"
        />
        <div slot="right">
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
          <yd-form-select
            clearable
            :selects="ISP_TYPE"
            v-model="bindParams.isp"
            placeholder="ISP"
            class="input-box"
            @change="$refs.DmData.initPage()"
          />
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" />
          <el-table-column label="节点IP" prop="id">
            <template slot-scope="{row}">
              {{row.ip || '--' }}
              <!-- <br />
              {{row.id || '--' }}-->
            </template>
          </el-table-column>
          <el-table-column label="ISP" prop="isp">
            <template slot-scope="{row}">
              {{
              formartValue(row, 'isp')
              }}
            </template>
          </el-table-column>
          <el-table-column label="归属地" prop="location">
            <template slot-scope="{row}">
              {{
              formartValue(row, 'location')
              }}
            </template>
          </el-table-column>
          <el-table-column label="节点风险等级">
            <template slot-scope="{row}">{{ip_type[row.ip_type] || '--'}}</template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="{row}">{{row.unshared ===1 ? '独享': '共享' }}</template>
          </el-table-column>
          <el-table-column label="监控状态">
            <template slot-scope="{row}">
              <span v-if="Number(row.target_status) === 1" class="success--color">正常</span>
              <span v-else-if="Number(row.target_status) === 2" class="warning--color">宕机</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column label="使用状态" prop="status">
            <template slot-scope="{row}">
              <span v-if="row.status === 1" class="success--color">启用</span>
              <span v-if="row.status === 0" class="red--color">禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="机器配置" prop="server_config" />
          <el-table-column label="操作" width="80px">
            <template slot-scope="{ row }">
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
                  <el-dropdown-item command="DEL" @click="del(row)">
                    <span style="color: red">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEdit
      ref="addedit"
      :ips="ips"
      @submit="
        (e) => {
          $refs.DmData.initPage();
        }
      "
    />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData';
import DmTable from '@/components/Dm/DmTable.vue';
import AddEdit from './components/add-source-node.vue';
import { areaView } from '@/utils/filter';
import ISP from '@/constants/isp';

export default {
  name: 'SourceList',
  components: { DmTable, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      areaView,
      // http://47.98.119.34:24680/poolBoundNodeList
      Fetch: this.FetchAccount,
      API_INDEX: '/pool/node/boundList',
      bindParams: {
        ip: '',
        status: '',
        isp: '',
        token: localStorage.getItem('token'),
        pool_id: this.$route.params.id
      },
      ISP,
      ip_pool: {
        0: '风险池',
        1: '普通池',
        2: '良好池'
      },
      risk_level: {
        1: '低风险',
        2: '中风险',
        3: '高风险'
      },
      ip_type: {
        1: '优质',
        2: '良好',
        3: '普通',
        4: '风险',
        5: '高风险'
      },
      type: {
        0: ' 默认',
        1: '全局配置',
        2: '高危风险池'
      },
      ISP_TYPE: ISP
    };
  },
  computed: {
    ips() {
      return (this.list && this.list.length && this.list.map(i => i.id)) || [];
    }
  },
  methods: {
    formartValue(data, prop) {
      if (prop === 'location') {
        let location = (!!data.location && data.location.split(',')) || [];
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
    handleOption(option, data) {
      if (option === 'DEL') {
        this.del(data);
      } else if (option === 'on' || option === 'off') {
        var status = {
          on: 1,
          off: 0
        };
        const params = {
          ids: this.multipleSelection.map(i => i.id).join(','),
          status: status[option],
          token: this.bindParams.token
        };
        this.editStatus(params);
      }
    },
    async editStatus(params) {
      try {
        await this.Fetch.post('/pool/node/statusSet', params);
        await this.$refs.DmData.initPage();
        this.Message('ACTION_SUCCESS');
      } catch (error) {
        return;
      }
    },
    async del(data) {
      if (!data.id) return;
      try {
        // http://47.98.119.34:24680/poolNodeUnBound
        await this.Fetch.post('/pool/node/unBound', {
          node_id: Number(data.id),
          pool_id: Number(this.$route.params.id),
          token: this.bindParams.token
        });
        await this.$refs.DmData.initPage();
        this.Message('ACTION_SUCCESS');
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
}
</style>