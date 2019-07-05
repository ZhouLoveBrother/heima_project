<template>
  <div class="right">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格区域 -->
    <el-table :data="rightList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <!-- 层级拿到的是level数字，需要转换成文字，自定义模板，使用插槽 -->
      <!-- prop中指定只能是数据对象中存在的属性名称 -->
      <el-table-column label="层级" width="100">
        <template slot-scope="scope">{{scope.row.level | levelFormat}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRightList } from '@/api/admin_right.js';
export default {
  data () {
    return {
      // 数据源
      rightList: []
    }
  },
  // 层级过滤器
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级';
      } else if (level === '1') {
        return '二级';
      } else if (level === '2') {
        return '三级';
      }
    }
  },
  // 钩子函数
  mounted () {
    getRightList('list')
      .then(res => {
        if (res.data.meta.status === 200) {
          this.rightList = res.data.data
        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  // 方法集合
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
