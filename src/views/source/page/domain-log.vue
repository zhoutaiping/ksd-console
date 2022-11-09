<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span>SDK内置调度域名 {{domain}} 解析IP切换日志</span>
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
            <!--  -->
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
          <!-- <yd-form-select
              clearable
              :selects="ISP_TYPE"
              v-model="bindParams.isp"
              placeholder="ISP"
              class="input-box"
              @change="$refs.DmData.initPage()"
          />-->
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column label="宕机IP" prop="id">
            <template slot-scope="{row}">{{row.ip || '--' }}</template>
          </el-table-column>
          <el-table-column label="替换IP">
            <template slot-scope="{row}">{{ formartValue(row, 'ip_') }}</template>
          </el-table-column>
          <el-table-column label="宕机时间">
            <template slot-scope="{row}">{{formartTime(row.error_at)}}</template>
          </el-table-column>
          <el-table-column label="更换时间">
            <template slot-scope="{row}">{{formartTime(row.updated_at)}}</template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip />
        </el-table>
      </DmTable>
    </DmData>
  </ConsolePageLayout>
</template>
    
<script>
import consoleData from '@/mixins/consoleData';
import DmTable from '@/components/Dm/DmTable.vue';
export default {
  name: 'domain-list-log',
  components: { DmTable },
  mixins: [consoleData],
  data() {
    return {
      Fetch: this.FetchAccount,
      API_INDEX: '',
      domain: this.$route.query.domain || '',
      bindParams: {
        domain_id: this.$route.params.id
      }
    };
  },
  methods: {
    formartValue(data, prop) {
      return data[prop];
    }
  }
};
</script>
    
<style lang="scss" scoped>
</style>
    