<template>
  <section class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="rightsList" border>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level === '1'" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<style lang="scss" scoped>
.rights {
  .el-table {
    margin-top: 30px;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      // 权限列表
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取权限列表
    async getRightsList(): Promise<any> {
      // @ts-ignore
      const reslut = (await this.$http.get('rights/list')).data;

      if (reslut.meta.status !== 200) {
        return this.$message.error(reslut.meta.msg);
      }

      this.rightsList = reslut.data;
    },
  },
});
</script>