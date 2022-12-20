<
<template>
  <div>
    <yd-card :loading="loading" :title="title">
      <Chart
        :loading="false"
        :data="data"
        :settings="settings"
        :extend="extend"
        height="500px"
      />
    </yd-card>

    <yd-card :loading="loading" :title="title2">
        <Chart
          :loading="false"
          :data="data_2"
          :settings="settings"
          :extend="extend"
          height="500px"
        />
      </yd-card>
  </div>
</template>

<script>
import chartMixins from "@/mixins/chart";
import Chart from "@/components/Chart/Chart";
import { formatData, tooltipAlone } from "@/utils/chart";

function formatDatValue(data, columns) {
  const x_data = data.x_data || [];
  const y_data = data.y_data || {
    data: [],
    unit: "",
  };
  const rows = x_data.map((time, index) => {
    return {
      [columns[0]]: time,
      [columns[1]]: y_data.data[index],
    };
  });
  console.log(rows);
  return {
    columns,
    rows,
  };
}
export default {
  name: "HistoryFlow",
  components: { Chart },
  props: {
    bindParams: Object,
  },
  mixins: [chartMixins],
  data() {
    return {
      API_URI: "POST /statistic/app/global/getalltopcountryofday",
      settings: {
        type: "bar",
      },
      extend: {
        xAxis: {
          boundaryGap: true,
        },
        tooltip: {
          trigger: "axis",
        },
      },
      title: "国家-玩家活跃TOP",
      title2: "各省份-玩家活跃TOP",
      data_2:[]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
      this.init2();
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

        // const data = {
        //   trend: {
        //     x_data: [
        //       "中国",
        //       "美国",
        //       "俄罗斯",
        //       "新加坡",
        //       "荷兰",
        //       "土耳其",
        //       "乌克兰",
        //       "立陶宛",
        //       "越南",
        //       "卢森堡",
        //       "比利时",
        //       "韩国",
        //       "法国",
        //       "德国",
        //       "日本",
        //       "印度",
        //       "波兰",
        //       "英国",
        //     ],
        //     y_data: {
        //       unit: "",
        //       data: [1, 5, 0, 0, 4, 0, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
        //     },
        //   },
        // };
        const unit =
          data.trend && data.trend.y_data ? data.trend.y_data.unit : "";
        this.settings.yAxisName = [`单位（${unit}）`];
        const _data = formatDatValue(data.trend, ["国家", "排名"]);
        console.log(_data);
        this.data = _data;
        this.data.tooltip = tooltipAlone(unit);
      } catch (error) {
        const unit = "";
        this.settings.yAxisName = [`单位（${unit}）`];
        this.data = formatData(
          {
            x_data: [0],
            y_data: {
              data: [0],
              unit: "",
            },
          },
          ["国家", "排名"],
          "number"
        );
        this.data.tooltip = tooltipAlone(unit);
      } finally {
        this.loading = false;
      }
    },
    async init2(params = {}) {
      params = {
        ...params,
        ...this.bindParams,
      };
      try {
        const data = await this.fetchData(params,'POST /statistic/app/global/getalltopprovinceofday');

    //     const data = {
    //     "trend": {
    //         "x_data": [
    //             "上海",
    //             "北京",
    //             "广东",
    //             "河南",
    //             "福建",
    //             "香港",
    //             "江苏",
    //             "贵州",
    //             "山东",
    //             "江西",
    //             "湖北",
    //             "安徽",
    //             "重庆",
    //             "陕西",
    //             "四川",
    //             "宁夏",
    //             "新疆",
    //             "浙江",
    //             "海南",
    //             "湖南",
    //             "甘肃",
    //             "西藏",
    //             "辽宁"
    //         ],
    //         "y_data": {
    //             "unit": "个",
    //             "data": [
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 1,
    //                 0,
    //                 0,
    //                 3,
    //                 0,
    //                 0,
    //                 22,
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 0,
    //                 0
    //             ]
    //         }
    //     }
    // }

        const unit =
          data.trend && data.trend.y_data ? data.trend.y_data.unit : "";
        this.settings.yAxisName = [`单位（${unit}）`];
        const _data = formatDatValue(data.trend, ["国家", "排名"]);
        console.log(_data);
        this.data_2 = _data;
        this.data_2.tooltip = tooltipAlone(unit);
      } catch (error) {
        const unit = "";
        this.settings.yAxisName = [`单位（${unit}）`];
        this.data_2 = formatData(
          {
            x_data: [0],
            y_data: {
              data: [0],
              unit: "",
            },
          },
          ["国家", "排名"],
          "number"
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
