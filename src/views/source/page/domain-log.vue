<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px">
      <span>SDK内置调度域名 {{domain}} 解析IP切换日志</span>
    </div>
    <DmData ref="DmData" @init="fetchList">
      <DmToolbar>
        <InputSearch
          v-model="bindParams.ip"
          placeholder="IP"
          @submit="$refs.DmData.initPage()"
          style="width:180px;"
        />
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table :data="list">
          <el-table-column label="宕机IP" show-overflow-tooltip>
            <template slot-scope="{row}">{{ formartValue(row, 'down_ips') }}</template>
          </el-table-column>
          <el-table-column label="替换IP" show-overflow-tooltip>
            <template slot-scope="{row}">{{ formartValue(row, 'replace_ips') }}</template>
          </el-table-column>
          <el-table-column label="更换时间">
            <template slot-scope="{row}">{{formartTime(row.switch_time)}}</template>
          </el-table-column>
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
      API_INDEX: '/domain/switch_log',
      domain: this.$route.query.domain || '',
      bindParams: {
        domain_id: this.$route.params.id
      }
    };
  },
  methods: {
    formartValue(data, prop) {
      return data[prop] || '--';
    }
  }
};
</script>
    
<style lang="scss" scoped>
</style>
    