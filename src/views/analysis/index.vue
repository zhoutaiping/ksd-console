<template>
  <ConsolePageLayout :tabs="tabs" title="分析报表" style="padding: 12px">
    <router-view
  /></ConsolePageLayout>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { label: "今日实时在线", name: "online-today" },
        { label: "平台今日/历史日活", name: "history-flow" },
        // { label: "平台今日/历史转发流量", name: "history-forward" },
        // { label: "套餐今日转发流量", name: "project-flow" },
        { label: "玩家排名(省/国家)", name: "player-rank" },
        { label: "节点请求数", name: "node-request" },
        // { label: "版本统计", name: "version" },
        // { label: "终端风险", name: "terminal-risk" },
      ],
    };
  },
  mounted() {},
  methods: {
    initPage() {},
  },
};
</script>

<style lang="sass" scoped></style>
