<
<template>
  <div>
    <yd-card :loading="loading" :title="title" >
      <el-row :gutter="12">
        <el-col :span="12">
            <DmTable min-height :loading="loading">
                <el-table :data="list.list_200">
                  <el-table-column label="ip" prop="ip"></el-table-column>
                  <el-table-column label="状态码200" prop="status_200"></el-table-column>
                </el-table>
            </DmTable>
        </el-col>
        <el-col :span="12">
            <DmTable min-height :loading="loading">
                <el-table :data="list.list_502">
                  <el-table-column label="ip" prop="ip"></el-table-column>
                  <el-table-column label="状态码200" prop="status_502"></el-table-column>
                </el-table>
            </DmTable>
        </el-col>
      </el-row>

    </yd-card>
  </div>
</template>

<script>
import chartMixins from "@/mixins/chart";
export default {
  name: "NodeRequest",
  props: {
    bindParams: Object,
  },
  mixins: [chartMixins],
  data() {
    return {
      API_URI: "POST /statistic/app/global/getallipstatusofday",
      settings: {
        type: "line",
      },
      loading:true,
      title:'节点请求状态',
      list:{
        list_200:[],
        list_502:[]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async init(params = {}) {
      params = {
        ...params,
        ...this.bindParams,
      };
      console.log(1);
      try {
        const data = await this.fetchData(params);

    //   const data = {"list_200":[{"ip":"139.155.245.100","status_200":5}],"list_502":[]}
        this.list = data
      }catch (error) {
        this.list = {
        list_200:[],
        list_502
      };
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
