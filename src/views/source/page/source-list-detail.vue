<template>
  <ConsolePageLayout>
    <DmData ref="DmData" @init="fetchList" :auto-init="false">
      <DmToolbar>
        <el-button type="primary" @click="$refs.addedit.handleOpen()"
          >新增</el-button
        >
        <el-button :disabled="!multipleSelection.length" @click="handleOption('on')">启用</el-button>
        <el-button :disabled="!multipleSelection.length" @click="handleOption('off')">禁用</el-button>
        <div slot="right">
          <InputSearch
            v-model="bindParams.ip"
            placeholder="节点IP"
            @submit="$refs.DmData.initPage()"
          />
        </div>
      </DmToolbar>
      <DmTable :loading="loading" min-height>
        <el-table
          :data="[
            {
              id: 2,
              pool_name: '资源池一',
              nodelist: [],
            },
          ]"
        >
        <el-table-column type="selection" />
          <el-table-column label="节点IP/ID" prop="id">
            <template slot-scope="{row}">
              {{row.ip || '--' }} <br/>
              {{row.id || '--' }}
            </template>
          </el-table-column>
          <el-table-column label="ISP" prop="isp" />
          <el-table-column label="节点池" prop="isp" >
            <template slot-scope="{row}">
              {{ip_pool[row.ip_pool] || '--' }}
            </template>
          </el-table-column>
          <el-table-column label="归属地" prop="location" />
          <el-table-column label="风险等级" />
          <el-table-column label="类型">
            <template slot-scope="{row}">
              {{row.unshared ===1 ? '独享': '共享' }}
            </template>
          </el-table-column>
          <el-table-column label="监控状态" prop="unshared" />
          <!-- <el-table-column label="是否删除" prop="is_delete" >
            <template slot-scope="{row}">
              {{row.is_delete ===1 ? '是': '否' }}
            </template>
          </el-table-column> -->
          <el-table-column label="使用状态" prop="status" >
            <template slot-scope="{row}">
              {{row.status ===1 ? '启用': '禁用' }}
            </template>
          </el-table-column>
          <el-table-column label="机器配置" prop="server_config" />
          <el-table-column label="" width="80px">
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
                  <el-dropdown-item command="DEL" @click="del(row)"
                    ><span style="color: red">删除</span></el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <AddEdit
      ref="addedit"
      @submit="
        (e) => {
          $refs.DmData.initPage();
        }
      "
    />
  </ConsolePageLayout>
</template>

<script>
import consoleData from "@/mixins/consoleData";
import DmTable from "@/components/Dm/DmTable.vue";
import AddEdit from "./components/add-source-node.vue";
export default {
  name: "SourceList",
  components: { DmTable, AddEdit },
  mixins: [consoleData],
  data() {
    return {
      // API_INDEX: '/poolList',
      bindParams: { ip: "" },
      risk_level: {
        1: "低风险",
        2: "中风险",
        3: "高风险",
      },
      type: {
        0: " 默认",
        1: "全局配置",
        2: "高危风险池",
      },
    };
  },
  methods: {
    handleOption(TYPE, data) {
      if (TYPE === "DEL") {
        this.del(data);
      }
    },
    async del(data) {
      if (!data.id) return;
      try {
        await this.Fetch.post("/poolNodeDelete", { id: data.id });
        await this.$refs.DmData.initPage();
        this.Message("ACTION_SUCCESS");
      } catch (error) {
        this.Message("ACTION_ERROR");
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
