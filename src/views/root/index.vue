<template>
  <el-container style="height: 100%; margin: 0,0,0,0;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="'1'" :router="true">
        <el-menu-item index="/home">
          <template slot="title">
            <i class="el-icon-setting"></i>首页
          </template>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>商品管理
          </template>
          <el-menu-item index="/pms">分类管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
