/* eslint-disable indent */
<template>
    <div>
        <el-switch v-model="draggable" active-text="开启拖拽" inactive-text="关闭拖拽"></el-switch>
        <el-button v-if="draggable" @click="batchSave">批量保存</el-button>
        <el-button type="danger" @click="batchDelete">批量删除</el-button>
        <el-tree
            :data="menus"
            show-checkbox
            :props="defaultProps"
            :expand-on-click-node="false"
            node-key="catId"
            :default-expanded-keys="expandedKey"
            :draggable="draggable"
            :allow-drop="allowDrop"
            @node-drop="handleDrop"
            ref="menuTree"
        >
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                    <el-button
                        v-if="node.level <=2"
                        type="text"
                        size="mini"
                        @click="() => append(data)"
                    >Append</el-button>
                    <el-button type="text" size="mini" @click="edit(data)">edit</el-button>
                    <el-button
                        v-if="node.childNodes.length==0"
                        type="text"
                        size="mini"
                        @click="() => remove(node, data)"
                    >Delete</el-button>
                </span>
            </span>
        </el-tree>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
        >
            <el-form :model="category">
                <el-form-item label="分类名称">
                    <el-input v-model="category.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-input v-model="category.icon" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="计量单位">
                    <el-input v-model="category.productUnit" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { request } from '../../../utils/httpRequest'

export default {
  data () {
    return {
      pCid: [],
      draggable: false,
      updateNodes: [],
      maxLevel: 0,
      title: '',
      dialogType: '', // edit,add
      category: {
        name: '',
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        productUnit: '',
        icon: '',
        catId: null
      },
      dialogVisible: false,
      menus: [],
      expandedKey: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    getMenus () {
      request('/product/category/list')
        .then(({ data }) => {
          if (data && data.categoryList && Array.isArray(data.categoryList)) {
            this.menus = data.categoryList
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    append (data) {
      this.dialogType = 'add'
      this.title = '添加分类'
      this.dialogVisible = true
      this.category.parentCid = data.catId
      this.category.catLevel = data.catLevel * 1 + 1
      this.category.catId = null
      this.category.name = ''
      this.category.icon = ''
      this.category.productUnit = ''
      this.category.sort = 0
      this.category.showStatus = 1
    },
    edit (data) {
      this.dialogType = 'edit'
      this.title = '修改分类'
      this.dialogVisible = true
      request(`/product/category/detail/${data.catId}`, 'GET')
        .then(({ data }) => {
          this.category.name = data.categoryDetail.name
          this.category.catId = data.categoryDetail.catId
          this.category.icon = data.categoryDetail.icon
          this.category.productUnit = data.categoryDetail.productUnit
          this.category.parentCid = data.categoryDetail.parentCid
          this.category.catLevel = data.categoryDetail.catLevel
          this.category.sort = data.categoryDetail.sort
          this.category.showStatus = data.categoryDetail.showStatus
        }).catch(err => {
          console.error(err)
        })
    },
    remove (node, data) {
      this.$confirm(`是否删除「${data.name}」菜单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const postData = [data.catId]
        request('/product/category/deleteByIds', 'POST', JSON.stringify(postData))
          .then(({ data }) => {
            this.$message({
              message: '菜单删除成功',
              type: 'success'
            })
            // 刷新出新的分类
            this.getMenus()
            // 设置默认展开的分类，被删分类的父分类
            this.expandedKey = [node.parent.data.catId]
          }).catch(err => {
            console.error(err)
          })
      }).catch(() => { })
    },
    submitData () {
      if (this.dialogType === 'add') {
        this.addCategory()
      }
      if (this.dialogType === 'edit') {
        this.editCategory()
      }
    },
    // 修改三级分类数据
    editCategory () {
      var { catId, name, icon, productUnit } = this.category
      request('/product/category/update', 'POST', JSON.stringify({ catId, name, icon, productUnit }))
        .then(({ data }) => {
          this.$message({
            message: '菜单修改成功',
            type: 'success'
          })
          // 关闭对话框
          this.dialogVisible = false
          // 刷新出新的菜单
          this.getMenus()
          // 设置需要默认展开的菜单
          this.expandedKey = [this.category.parentCid]
        })
    },
    // 添加三级分类
    addCategory () {
      request('/product/category/insert', 'POST', JSON.stringify(this.category))
        .then(({ data }) => {
          this.$message({
            message: '菜单保存成功',
            type: 'success'
          })
          // 关闭对话框
          this.dialogVisible = false
          // 刷新出新的菜单
          this.getMenus()
          // 设置需要默认展开的菜单
          this.expandedKey = [this.category.parentCid]
        })
    },
    // 判断本次拖拽是否被允许
    allowDrop (draggingNode, dropNode, type) {
      // 1、被拖动的当前节点以及所在的父节点总层数不能大于3

      // 1）、被拖动的当前节点总层数
      console.log('allowDrop:', draggingNode, dropNode, type)
      //
      this.countNodeLevel(draggingNode)
      // 当前正在拖动的节点+父节点所在的深度不大于3即可
      let deep = Math.abs(this.maxLevel - draggingNode.level) + 1
      console.log('深度：', deep)

      //   this.maxLevel
      if (type === 'inner') {
        // console.log(
        //   `this.maxLevel：${this.maxLevel}；draggingNode.data.catLevel：${draggingNode.data.catLevel}；dropNode.level：${dropNode.level}`
        // );
        return deep + dropNode.level <= 3
      } else {
        return deep + dropNode.parent.level <= 3
      }
    },
    countNodeLevel (node) {
      // 找到所有子节点，求出最大深度
      if (node.childNodes != null && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].level > this.maxLevel) {
            this.maxLevel = node.childNodes[i].level
          }
          this.countNodeLevel(node.childNodes[i])
        }
      }
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('handleDrop: ', draggingNode, dropNode, dropType)
      // 1、当前节点最新的父节点id
      let pCid = 0
      let siblings = null
      if (dropType === 'before' || dropType === 'after') {
        pCid =
                    dropNode.parent.data.catId === undefined
                      ? 0
                      : dropNode.parent.data.catId
        siblings = dropNode.parent.childNodes
      } else {
        pCid = dropNode.data.catId
        siblings = dropNode.childNodes
      }
      this.pCid.push(pCid)

      // 2、当前拖拽节点的最新顺序，
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].data.catId === draggingNode.data.catId) {
          // 如果遍历的是当前正在拖拽的节点
          let catLevel = draggingNode.level
          if (siblings[i].level !== draggingNode.level) {
            // 当前节点的层级发生变化
            catLevel = siblings[i].level
            // 修改他子节点的层级
            this.updateChildNodeLevel(siblings[i])
          }
          this.updateNodes.push({
            catId: siblings[i].data.catId,
            sort: i,
            parentCid: pCid,
            catLevel: catLevel
          })
        } else {
          this.updateNodes.push({ catId: siblings[i].data.catId, sort: i })
        }
      }
      // 3、当前拖拽节点的最新层级
      console.log('updateNodes', this.updateNodes)
    },
    updateChildNodeLevel (node) {
      if (node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          var cNode = node.childNodes[i].data
          this.updateNodes.push({
            catId: cNode.catId,
            catLevel: node.childNodes[i].level
          })
          this.updateChildNodeLevel(node.childNodes[i])
        }
      }
    },
    batchDelete () {
      let catIds = []
      let checkedNodes = this.$refs.menuTree.getCheckedNodes()
      console.log('被选中的元素', checkedNodes)
      for (let i = 0; i < checkedNodes.length; i++) {
        catIds.push(checkedNodes[i].catId)
      }
      this.$confirm(`是否批量删除【${catIds}】菜单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request('/product/category/deleteByIds', 'POST', JSON.stringify(catIds))
            .then(({ data }) => {
              this.$message({
                message: '菜单批量删除成功',
                type: 'success'
              })
              this.getMenus()
            })
        })
        .catch(() => { })
    },
    batchSave () {
      request('/product/category/batchUpdate/', 'POST', JSON.stringify(this.updateNodes))
        .then(({ data }) => {
          this.$message({
            message: '菜单顺序等修改成功',
            type: 'success'
          })
          // 刷新出新的菜单
          this.getMenus()
          // 设置需要默认展开的菜单
          this.expandedKey = this.pCid
          this.updateNodes = []
          this.maxLevel = 0
          // this.pCid = 0;
        })
    }
  },
  created () {
    this.getMenus()
  }
}
</script>
