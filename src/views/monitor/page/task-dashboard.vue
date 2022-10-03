<template>
  <ConsolePageLayout>
    <div slot="header" style="margin-bottom: 10px;">
        <span>
            加入到监控中的监控任务信息
        </span>
    </div>
    <DmToolbar>
      <InputSearch v-model="bindParams.ip" :placeholder="'监控点'" @submit="handleSearch" class="input-box"/>
      <div slot="right">
        <SelectDateFilter v-model="bindParams" @change="handleSearch"/>
      </div>
    </DmToolbar>
    <DmCard title="平均响应延迟" class="margin-top">

    </DmCard>
    <DmCard title="可用率"  class="margin-top">

    </DmCard>
  </ConsolePageLayout>
</template>

<script>
import InputSearch from '@/components/Input/InputSearch.vue';
import SelectDateFilter from '@/components/Select/SelectDateFilter.vue';
export default {
    name: "TaskDashboard",
    components: { InputSearch, SelectDateFilter },
    data() {
      return {
        bindParams:{
          ip:'',
          start_time:'',
          end_time:''
        }
      }
    },
    methods:{
      handleSearch(params) {
        console.log({...params})
      }
    }
}
</script>

<style lang="scss" scoped>
.input-box {
  width: 200px;
}
</style>