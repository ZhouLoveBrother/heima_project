<template>
  <div class="roleList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" round style="margin-bottom:15px;">添加角色</el-button>
    <!-- 表格区域 -->
    <el-table :data="roleList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 栅格系统 展开行-->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:10px;border-bottom:1px #ccc dashed;"
          >
            <el-col :span="4">
              <el-tag closable type="success">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag closable type="success">{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="info"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin-right:4px;margin-bottom:6px"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length === 0">没有任何的权限，请先去分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- scope.row 这个值可以获取当前的对象的数据源 -->
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button type="primary" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllRoleLlist } from "@/api/admin_role.js";
export default {
  data() {
    return {
      roleList: []
    };
  },
  // 方法集合
  methods: {},
  // 钩子函数
  mounted() {
    // 获取角色列表所有数据
    getAllRoleLlist()
      .then(res => {
        if (res.data.meta.status) {
          console.log(res);
          this.roleList = res.data.data;
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
};
</script>
<style lang="less" scoped>
</style>
