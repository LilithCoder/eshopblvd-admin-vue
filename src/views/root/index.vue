<template>
  <el-container style="height: 100%; margin: 0,0,0,0;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="1" :router="true">
        <el-menu-item index="/home">
          <template slot="title">
            <i class="el-icon-setting"></i>首页
          </template>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-setting"></i>商品管理
          </template>
          <el-menu-item index="/pms">商品列表</el-menu-item>
          <el-menu-item index="/pms/addProduct">添加商品</el-menu-item>
          <el-menu-item index="/pms/addProduct">商品分类</el-menu-item>
          <el-menu-item index="/pms/addProduct">商品类型</el-menu-item>
          <el-menu-item index="/pms/addProduct">品牌管理</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>订单管理
          </template>
          <el-menu-item index="/pms">订单列表</el-menu-item>
          <el-menu-item index="/pms/addProduct">订单设置</el-menu-item>
          <el-menu-item index="/pms/addProduct">退货申请处理</el-menu-item>
          <el-menu-item index="/pms/addProduct">退货原因设置</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-setting"></i>营销管理
          </template>
          <el-menu-item index="/pms">秒杀活动列表</el-menu-item>
          <el-menu-item index="/pms/addProduct">优惠券列表</el-menu-item>
          <el-menu-item index="/pms/addProduct">品牌推荐</el-menu-item>
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
