<template>
  <div>
    <el-input
      :value="value"
      @input="changeValue"
      @focus="onfocus"
      @blur="onblur"
      :placeholder="placeholder"
      ref="inputValue"
    ></el-input>
    <div class="el-picker-panel" :style="pStyle" v-show="visible" ref="elcombogrid">
      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          @row-click="rowClick"
          stripe
          size="mini"
          element-loading-text="Loading"
          fit
          border
          highlight-current-row
        >
          <el-table-column v-if="showIndex" label="序号" type="index" align="center" width="50"></el-table-column>
          <el-table-column
            v-for="item in columns"
            :type="item.type"
            :key="item.key"
            :label="item.label"
            :prop="item.key"
            :align="item.align"
            :width="item.width"
            :header-align="item.headerAlign"
          >
            <template slot-scope="scope">
              <span>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <cus-pagination
          v-show="pagination"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>
<!-- <el-combo-grid  v-model="form.studentName"
                :placeholder="'请选择交款学生'"
                :requestUrl="'/api/edu/student/listPage'"
                 :requestParam="{}"
                :pagination="true"
                :columns="students_columns"
                :show-index="true"
                :item-value="'name'"
                :panel-style="'width:550px'"
                @row-select-event="studentSelect"
>
</el-combo-grid> -->
  <script>
import request from '@/service/request-account';

export default {
  name: 'el-combo-grid',
  props: {
    placeholder: { type: String },
    value: { type: String },
    requestUrl: { type: String },
    columns: { type: Array },
    panelStyle: { type: String },
    itemValue: { type: String },
    showIndex: { type: Boolean },
    pagination: { type: Boolean },
    requestParam: { type: Object }
  },
  data() {
    return {
      visible: false,
      pStyle: 'width:500px',
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 5,
        keyword: null
      },
      keyword: ''
    };
  },
  methods: {
    changeValue(val) {
      this.$emit('input', val); //向上级传送数据
      this.keyword = val;
      this.getList();
    },
    onfocus(el) {
      this.pStyle = this.panelStyle + ';position:absolute;z-index:999999';
      this.visible = true;
      this.keyword = el.target.value;
      this.getList();
    },
    onblur(el) {},
    getList() {
      if (this.pagination) {
        this.listQuery.keyword = this.keyword;
      } else {
        if (this.keyword) {
          this.listQuery = {
            keyword: this.keyword
          };
        } else {
          this.listLoading = false;
          return; //如果不分页，无keyword不查询数据（避免大数据量）
        }
      }
      if (this.requestParam) {
        let param = this.requestParam;
        for (let p in param) {
          this.listQuery[p] = param[p];
        }
      }
      this.listLoading = true;
      this.queryTableData(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    queryTableData(query) {
      return request({
        url: this.requestUrl,
        method: 'post',
        data: query
      });
    },
    rowClick: function(row, column, event) {
      this.$emit('row-select-event', row, column, event);
      this.$emit('input', row[this.itemValue]);
      this.visible = false;
    }
  }
};
</script>