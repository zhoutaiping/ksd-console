<template>
  <ConsolePageLayout style="padding:12px;">
    <DmData ref="DmData" @init="fetchList">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.app_name"
          placeholder="应用名称"
          @submit="handleSearch"
          style="width:200px"
        />
        <el-select
          v-model="bindParams.user_id"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="用户邮箱"
          :remote-method="e => getUserList(e,'email')"
          :loading="user_loading"
          @change="handleSearch"
        >
          <el-option
            v-for="item in email_list"
            :key="item.user_id"
            :label="item.email"
            :value="item.user_id"
          ></el-option>
        </el-select>
        <el-select
          v-model="bindParams.tenant_id"
          filterable
          remote
          clearable
          reserve-keyword
          placeholder="租户网络前缀模糊搜索"
          :remote-method="getTenantList"
          :loading="tenant_loading"
          @change="handleSearch"
        >
          <el-option
            v-for="item in tenant_list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div slot="right"></div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list" @selection-change="handleSelectionChange">
          <el-table-column label="序号" type="index" width="55" />
          <el-table-column label="应用名称" prop="app_name" min-width="150" show-overflow-tooltip>
            <template slot-scope="{ row }">{{row.app_name || '--'}}</template>
          </el-table-column>
          <el-table-column label="AccessKey" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.access_key }}</span>
              <el-tooltip content="点击可复制到粘贴板">
                <el-button
                  v-if="scope.row.access_key"
                  type="text"
                  @click="copyAccessKey(scope.row,'access_key')"
                >
                  <i class="el-icon-copy-document" style="margin-left: 8px" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="UUID" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip content="点击可复制到粘贴板">
                <el-button type="text" @click="copyAccessKey(scope.row,'uuid')">
                  copy-uuid
                  <i class="el-icon-copy-document" style="margin-left: 8px" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="资源池" prop="pool_name" min-width="150" show-overflow-tooltip>
            <template slot-scope="{ row }">{{row.pool_name || '--'}}</template>
          </el-table-column>
          <el-table-column label="用户昵称" prop="nick_name" min-width="100" show-overflow-tooltip>
            <template slot-scope="{ row }">{{formartVal(row, 'nick_name')|| '--'}}</template>
          </el-table-column>
          <el-table-column label="用户邮箱" prop="email" min-width="140" show-overflow-tooltip>
            <template slot-scope="{ row }">{{formartVal(row, 'email')|| '--'}}</template>
          </el-table-column>
          <el-table-column label="租户网络" prop="tenant" min-width="140" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <a @click="handleOption('link', row)">{{formartVal(row, 'tenant')|| '--'}}</a>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="created_at" width="150" show-overflow-tooltip>
            <template slot-scope="{row}">{{formartTime(row.created_at)}}</template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
          <el-table-column label="操作" width="140" fixed="right" align="right">
            <template slot-scope="{row}">
              <el-dropdown @command="(e) => {handleOption(e, row);}">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit">编辑应用</el-dropdown-item>
                  <el-dropdown-item command="config">资源池设置</el-dropdown-item>
                  <el-dropdown-item command="link">租户平台</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Add ref="Add" @submit="handleSearch" />
    <Config ref="config" @init="handleSearch" />
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData';
import ColumnExpireTime from '@/components/Column/ColumnExpireTime';
import Add from '../components/add-edit.vue';
import Config from '../components/config.vue';
import defaultSettings from '@public/settings';

export default {
  components: { ColumnExpireTime, Add, Config },

  mixins: [consoleData],

  data() {
    return {
      Fetch: this.FetchAccount,
      API_INDEX: '/sdk/list',
      bindParams: {
        token: localStorage.getItem('token')
      },
      user_list: [],
      email_list: [],
      user_loading: false,
      tenant_loading: false,
      tenant_list: []
    };
  },
  computed: {
    domain_suffix() {
      return (
        this.$store.getters.domain_suffix ||
        localStorage.getItem('domain_suffix')
      );
    }
  },
  mounted() {
    // this.getUserList();
    // this.getTanantList();
  },
  methods: {
    async getUserList(search = '', type = '') {
      console.log(search, type);
      if (type === 'email') {
        this.email_list = [];
      } else {
        this.user_list = [];
      }

      if (search !== '' && type) {
        this.user_loading = true;

        try {
          const params = {
            token: localStorage.getItem('token')
          };
          params[type] = search;
          const data = await this.Fetch.get('/user/search', params);
          const { list = [] } = data || {};
          // this.user_list = list || [];
          if (type === 'email') {
            this.email_list = list;
          } else {
            this.user_list = list;
          }
        } catch (error) {
          return;
        } finally {
          setTimeout(() => {
            this.user_loading = false;
          }, 200);
        }
      }
    },
    async getTenantList(tenant_name) {
      if (tenant_name !== '') {
        this.tenant_loading = true;
        this.user_list = [];
        try {
          const data = await this.Fetch.get('/user/tenant/search', {
            token: localStorage.getItem('token'),
            tenant_prefix: tenant_name
          });
          const { list = [] } = data || {};

          this.tenant_list =
            list.map(i => {
              return {
                label: i.tenant_prefix + '.' + this.domain_suffix,
                value: i.tenant_id
              };
            }) || [];
        } catch (error) {
          return;
        } finally {
          setTimeout(() => {
            this.tenant_loading = false;
          }, 200);
        }
      } else {
        this.tenant_list = [];
      }
    },

    formartVal(data, key) {
      let val = '';
      if (key === 'email') {
        const user = data['user_info'] || null;
        val = (user && user.email) || '';
      }
      if (key === 'nick_name') {
        const user = data['user_info'] || null;
        val = (user && user.nick_name) || '';
      }
      if (key === 'tenant') {
        const tenant = data['tenant_info'] || null;
        if (tenant) {
          val = tenant.tenant_prefix + '.' + this.domain_suffix;
        }
      }

      return val;
    },
    copyAccessKey(row, type) {
      if (type === 'access_key') {
        this.Help.copyText(row[type]);
        this.$message.success('复制成功');
      } else if (type === 'uuid') {
        this.FetchAccount.get('/sdk/builtin_config', {
          sdk_id: row.sdk_id,
          tenant_id: row.tenant_id
        })
          .then(res => {
            this.Help.copyText(res.uuid);
            this.$message.success('复制成功');
          })
          .catch(e => {
            this.$message.warning('复制失败');
          });
      }
    },
    handleOption(option, data) {
      if (option === 'edit') {
        this.$refs.Add.handleOpen(data, { mode: 'Edit' });
      }
      if (option === 'config') {
        this.$refs.config.handleOpen(data);
      }
      if (option === 'link') {
        const customer_user_id = data.user_id || '';
        const tenant_id = data['tenant_info'].tenant_id || '';
        const token = JSON.parse(JSON.stringify(localStorage.getItem('token')));
        const tenant_prefix = 'https://' + this.formartVal(data, 'tenant');
        console.log(
          data,
          customer_user_id,
          tenant_prefix +
            '?token=' +
            token +
            '&customer_user_id=' +
            customer_user_id +
            '&tenant_id=' +
            tenant_id
        );
        if (process.env.NODE_ENV === 'development') {
          // window.location.replace(
          //   'http://localhost:8080/' +
          //     '?token=' +
          //     token +
          //     '&customer_user_id=' +
          //     customer_user_id +
          //     '&tenant_id=' +
          //     tenant_id
          // );
          return;
        } else {
          const url =
            tenant_prefix +
            '?token=' +
            token +
            '&customer_user_id=' +
            customer_user_id +
            '&tenant_id=' +
            tenant_id;

          window.open(url, '_blank');
          // window.location.replace(
          //   tenant_prefix +
          //     '?token=' +
          //     token +
          //     '&customer_user_id=' +
          //     customer_user_id +
          //     '&tenant_id=' +
          //     tenant_id
          // );
        }
      }
    }
  }
};
</script>
