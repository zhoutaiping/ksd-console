<template>
  <ConsolePageLayout style="padding:12px;">
    <DmToolbar>
      <el-button type="primary" @click="$refs.Add.handleOpen()">新增应用</el-button>
      <el-button  @click="$refs.DmData.initPage()">刷新</el-button>
      <!-- <el-button :disabled="!multipleSelection.length" @click="">删除</el-button>
      <div slot="right">
        <InputSearch />
      </div> -->
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table :data="list" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" /> -->
          <el-table-column
            label="应用名称"
            prop="app_name"
            min-width="150"
          />
          <el-table-column
            label="用户名称"
            prop="package_name"
            min-width="150"
          />
          <el-table-column
            label="应用状态"
            prop="status"
            min-width="150"
          >
            <template slot-scope="{row}">
              {{row.status === 1 ?"启用":'禁用'}}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="更新时间"
            prop="updated_at"
            min-width="150"
          />
          <!-- <el-table-column
            label="AccessKey"
            min-width="150"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.access_key }}</span>
              <el-tooltip content="点击可复制到粘贴板">
                <el-button
                  type="text"
                  @click="copyAccessKey(scope.row)"
                ><i
                  class="el-icon-copy-document"
                  style="margin-left: 8px"
                /></el-button>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column
            v-if="false"
            label="到期时间"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnExpireTime :expire-time="scope.row.expire_time" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="right"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="$refs.Add.handleOpen(scope.row, {mode:'Edit'})">
                编辑
              </el-button>
              <!-- <router-link :to="{name: `SDK_meal__id`, params: {id: scope.row.id}}"> -->
              <el-button type="text" @click="$refs.config.handleOpen()">
                管理
              </el-button>
              <el-divider direction="vertical" />
              <el-button type="text" @click="del(scope.row)">
                删除
              </el-button>
              <!-- </router-link> -->
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <Add ref="Add" />
    <Config ref="config" @submit="$refs.DmData.initPage()"/>
  </ConsolePageLayout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import Add from '../components/add.vue'
import Config from '../components/config.vue'
export default {

  components: { ColumnExpireTime, Add, Config },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: '/list'
    }
  },

  methods: {
    copyAccessKey(row) {
      this.Help.copyText(row.access_key)
      this.$message.success('复制成功')
    },

    async del(data) {
      if(!data.id) return
      try {
        await this.Fetch.post('/delete', {id: data.id})
        await this.$refs.DmData.initPage()
        this.Message('ACTION_SUCCESS')
      } catch (error) {
        this.Message('ACTION_ERROR')
        return
      }
    }
  }
}
</script>
