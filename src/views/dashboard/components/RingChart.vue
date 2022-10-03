<template>
  <div v-loading="loading" :id="id" :style="{height:height,width:width}"/>
</template>
<script>
import { Ring } from '@antv/g2plot'
export default {
  props: {
    id: {
      type: String,
      default: 'container'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => {
        return [{ value: 0, name: '暂无数据' }]
      }
    }
  },
  data() {
    return {
      ringPlot: null
    }
  },
  methods: {
    init() {
      const data = this.data
      const ringPlot = new Ring(this.$el, {
        forceFit: true,
        title: {
          visible: true,
          text: '套餐'
        },
        description: {
          visible: true,
          text: ''
        },
        radius: 0.8,
        padding: 'auto',
        data,
        angleField: 'value',
        colorField: 'type'
      })

      ringPlot.render()
    }
  }
}
</script>
