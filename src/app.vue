<template>
  <div>
    <kl-flex :grow="2" basis="300px" style="height:1000px">
      <el-input v-model="a" v-int />
    </kl-flex>
    <el-table
      :data="tableData"
      v-tableSticky
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    <div style="height:1000px"></div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import KlFlex from '@/base/components/kl.flex/index.vue';

// @Component 修饰符注明了此类为一个 Vue 组件
@Component({
  components: {
    KlFlex,
  },
})
export default class App extends Vue {
  a = null

  tableData = [{
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518弄',
  }, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄',
  }, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄',
  }, {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄',
  }]
}
</script>
