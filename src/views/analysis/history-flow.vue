<
<template>
  <div>
    <yd-card :loading="loading" :title="title" height="400">
      <Chart
      :loading="false"
      :data="data"
      :settings="settings"
      height="350px"
    />
    </yd-card>
  </div>
</template>

<script>
import chartMixins from "@/mixins/chart";
import Chart from "@/components/Chart/Chart";
import { formatData, tooltipAlone } from "@/utils/chart";
export default {
  name: "HistoryFlow",
  components:{Chart},
  props: {
    bindParams: Object,
  },
  mixins: [chartMixins],
  data() {
    return {
      API_URI: "POST /statistic/app/global/getallactiveofmonth",
      settings: {
        type: "line",
      },
      title:'日活(个)'
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
        // const data = await this.fetchData(params);

      const data = {
        "trend": {
            "x_data": [
                "2022-12-06 00:00:00",
                "2022-12-07 00:00:00",
                "2022-12-08 00:00:00",
                "2022-12-09 00:00:00",
                "2022-12-10 00:00:00",
                "2022-12-11 00:00:00",
                "2022-12-12 00:00:00",
                "2022-12-13 00:00:00",
                "2022-12-14 00:00:00",
                "2022-12-15 00:00:00",
                "2022-12-16 00:00:00",
                "2022-12-17 00:00:00",
                "2022-12-18 00:00:00"
            ],
            "y_data": {
                "unit": "个",
                "data": [
                    1,
                    1,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    1
                ]
            }
        }
      }
      const unit =
          data.trend && data.trend.y_data ? data.trend.y_data.unit : "";
        this.settings.yAxisName = [`单位（${unit}）`];
        this.data = formatData(data.trend, ["时间", "日活"]);
        this.data.tooltip = tooltipAlone(unit);
      }catch (error) {
        const unit = "QPS";
        this.settings.yAxisName = [`单位（${unit}）`];
        this.data = formatData(
          {
            x_data: [0],
            y_data: {
              data: [0],
              unit: "个",
            },
          },
          ["时间", "日活"]
        );
        this.data.tooltip = tooltipAlone(unit);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
