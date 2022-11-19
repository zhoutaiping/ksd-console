<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span>分布式节点服务，SDK服务网关</span>
      <div style="position: absolute; right: 20px; top: 20px">
        <el-button :disabled="!multipleSelection.length" @click="handleOption('on')">启用</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('off')">禁用</el-button>
        <el-button type="primary" @click="handleOption('add')">新增</el-button>
      </div>
    </div>
    <DmData ref="DmData" @init="fetchList">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.ip"
          placeholder="ip"
          @submit="$refs.DmData.initPage()"
          style="width:180px;"
        />
        <div slot="right">
          <el-select
            v-model="bindParams.ip_type"
            clearable
            placeholder="风险类型"
            style="width:130px;margin-right: 10px;"
            @change="$refs.DmData.initPage()"
          >
            <el-option
              v-for="(item, index) in Object.keys(ip_type)"
              :key="index"
              :value="item"
              :label="ip_type[item]"
            />
          </el-select>
          <yd-form-select
            clearable
            :selects="node_cate_list"
            v-model="bindParams.node_cate"
            placeholder="节点类型"
            style="width:130px;margin-right: 10px;"
            @change="$refs.DmData.initPage()"
          />
          <el-select
            v-model="bindParams.status"
            clearable
            placeholder="启用状态"
            style="width:130px;margin-right: 10px;"
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
            style="width:130px;"
            @change="$refs.DmData.initPage()"
          />
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list" @selection-change="handleSelectionChange">
          <el-table-column type="selection" />
          <el-table-column label="节点IP" prop="id">
            <template slot-scope="{row}">{{row.ip || '--' }}</template>
          </el-table-column>
          <el-table-column label="ISP" prop="isp">
            <template slot-scope="{row}">{{ formartValue(row, 'isp') }}</template>
          </el-table-column>
          <el-table-column label="归属地" prop="location">
            <template slot-scope="{row}">{{formartValue(row, 'location')}}</template>
          </el-table-column>
          <el-table-column label="风险类型">
            <template slot-scope="{row}">{{ip_type[row.ip_type] || '--'}}</template>
          </el-table-column>
          <el-table-column label="节点类型">
            <template slot-scope="{row}">
              <p
                v-for="(item, _) in formartValue(row, 'node_cate')"
                :key="_"
                style="margin-bottom:0px;"
              >{{item}}</p>
            </template>
          </el-table-column>
          <el-table-column label="独享类型">
            <template slot-scope="{row}">{{Number(row.unshared) === 1 ? '独享': '共享' }}</template>
          </el-table-column>
          <el-table-column label="使用状态" prop="status">
            <template slot-scope="{row}">
              <span v-if="row.status === 1" class="success--color">启用</span>
              <span v-if="row.status === 0" class="red--color">禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="机器配置" prop="server_config" />
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column label="操作" fixed="right" width="120" align="right">
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
                  <el-dropdown-item command="del">
                    <span style="color: red">删除</span>
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
import AddEdit from '../components/add-node.vue';
import { areaView } from '@/utils/filter';
import ISP from '@/constants/isp';
export default {
  name: 'NodeList',
  components: { DmTable, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      areaView,
      Fetch: this.FetchAccount,
      API_INDEX: '/pool/node/list',
      bindParams: {
        token: localStorage.getItem('token')
      },
      ip_type: {
        1: '高风险',
        2: '中风险',
        3: '低风险'
      },
      status: {
        0: ' 禁用',
        1: '启用'
      },
      ISP_TYPE: ISP
    };
  },
  computed: {
    node_cate_list() {
      const list = this.$store.getters.node_cate_list || [];

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
      if (prop === 'location') {
        let location = [];
        if (!!data[prop]) {
          location = (!!data[prop] && data[prop].split(',')) || [];
        }
        if (!location.length) {
          if (data.country) location.push(data.country);
          if (data.province) location.push(data.province);
        }
        return (location.length && this.areaView(location)) || '--';
      }

      if (prop === 'isp') {
        let isp = data[prop];
        isp = this.ISP_TYPE.find(i => i.value === isp)
          ? this.ISP_TYPE.find(i => i.value === isp).label
          : '';
        return isp;
      }

      if (prop === 'node_cate') {
        let val = (data[prop] && data[prop].split(',')) || [];
        val = val.map(i => {
          const find = this.node_cate_list.find(
            _ => Number(_.value) === Number(i)
          );
          return (find && find.label) || '';
        });
        return (val && val) || [];
      }

      // const dataMap = {
      //   node_cate: (data, key) => {
      //     let val = data[key];
      //     val = this.node_cate_list.find(i => Number(i.value) === Number(val));

      //     return (val && val.label) || '';
      //   },
      //   location: (data, key) => {
      //     let location = [];
      //     if (!!data[key]) {
      //       location = (!!data[key] && data[key].split(',')) || [];
      //     }
      //     if (!location.length) {
      //       if (data.country) location.push(data.country);
      //       if (data.province) location.push(data.province);
      //     }
      //     return (location.length && this.areaView(location)) || '--';
      //   },
      //   isp: (data, key) => {
      //     let isp = data[key];
      //     isp = this.ISP_TYPE.find(i => i.value === isp)
      //       ? this.ISP_TYPE.find(i => i.value === isp).label
      //       : '';
      //     return isp;
      //   }
      // };

      // return dataMap[prop](data, prop);
    },
    handleOption(option, data) {
      if (option === 'add') {
        this.$refs.addedit.handleOpen();
      } else if (option === 'edit') {
        this.$refs.addedit.handleOpen(data, { mode: 'Edit' });
      } else if (option === 'del') {
        this.del(data);
      } else if (option === 'on') {
        const params = {
          ids: this.multipleSelection.map(i => i.id).join(','),
          status: 1,
          token: localStorage.getItem('token')
        };
        this.editStatus(params);
      } else if (option === 'off') {
        const params = {
          ids: this.multipleSelection.map(i => i.id).join(','),
          status: 0,
          token: localStorage.getItem('token')
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
        // this.Message('ACTION_ERROR');
        return;
      }
    },
    async del(data) {
      if (!data.id) return;
      try {
        await this.Fetch.post('/pool/node/delete', {
          id: Number(data.id),
          token: localStorage.getItem('token')
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
