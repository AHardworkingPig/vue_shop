<template>
  <section class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色 -->
    <el-row class="addUser-row">
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 角色列表区 -->
    <el-table :data="rolesList" border>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            class="roleList-row"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
          >
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="showDeleteDialog(scope.row, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级权限 三级权限 -->
            <el-col :span="19">
              <el-row
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
                :class="[i2 === 0 ? '' : 'bdtop']"
              >
                <!-- 二级 -->
                <el-col :span="6">
                  <el-tag
                    closable
                    @close="showDeleteDialog(scope.row, item2.id)"
                    type="success"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级 -->
                <el-col :span="18">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                    @close="showDeleteDialog(scope.row, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="174">
        <template slot-scope="scope">
          <el-tooltip
            content="编辑"
            placement="top"
            effect="light"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
          </el-tooltip>
          <!-- 删除 -->
          <el-tooltip
            content="删除"
            placement="top"
            effect="light"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </el-tooltip>
          <!-- 分配权限 -->
          <el-tooltip
            content="分配权限"
            placement="top"
            effect="light"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 删除相应权限的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="35%"
      top="30vh"
      @close="deleteDialogClosed"
      class="delete-dialog"
    >
      <!-- 内容主体 -->
      <span class="delete-dialog-main"
        ><i class="el-icon-warning"></i><span>你确定要删除此权限吗?</span></span
      >

      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="removeById" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<style lang="scss" scoped>
.roles {
  .addUser-row {
    margin: 30px 0;
  }

  .roleList-row {
    display: flex;
    align-items: center;

    .el-col {
      &:first-of-type {
        padding: 10px 0;
      }

      .el-icon-caret-right {
        margin-left: 10px;
      }
    }

    // 嵌套row
    .el-row {
      display: flex;
      align-items: center;

      .el-col {
        &:nth-of-type(2) {
          .el-tag {
            margin: 10px 10px 10px 0;
          }
        }
      }
    }
  }

  .bdtop {
    border-top: 1px solid #eeeeee;
  }

  .bdbottom {
    border-bottom: 1px solid #eeeeee;
  }

  .delete-dialog {
    .delete-dialog-main {
      display: flex;
      align-items: center;

      i {
        color: #e6a23c;
        margin-right: 10px;

        &::before {
          font-size: 30px;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      // 所有角色列表
      rolesList: [],
      // 删除对话框是否显示
      deleteDialogVisible: false,
      // 要删除的权限id
      deleteRightsId: 0,
      // 要删除的角色id
      deleteUserId: 0,
      // 要删除的角色信息
      roleInfo: {},
      // 控制分配权限对话框是否显示
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 要被分配权限的角色id
      rightRoleId: 0,
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList(): Promise<any> {
      // @ts-ignore
      const reslut = (await this.$http.get('roles')).data;

      if (reslut.meta.status !== 200) {
        return this.$message.error(reslut.meta.msg);
      }

      this.rolesList = reslut.data;
    },
    // 根据id删除对应权限
    async removeById(): Promise<any> {
      const result = /* @ts-ignore */ (
        await this.$http.delete(
          `roles/${this.deleteUserId}/rights/${this.deleteRightsId}`
        )
      ).data;
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }
      // 防止删除成功还显示撤销删除消息
      this.deleteRightsId = -1;
      this.deleteUserId = -1;
      // @ts-ignore
      this.roleInfo.children = result.data;
      this.deleteDialogVisible = false;
      this.$message.success(result.meta.msg);
    },
    // 保存要删除的用户id和打开删除框
    showDeleteDialog(role: any, rightsId: number) {
      this.deleteDialogVisible = true;
      this.deleteRightsId = rightsId;
      this.deleteUserId = role.id;
      this.roleInfo = role;
    },
    // 删除用户关闭去前的回调
    deleteDialogClosed() {
      if (this.deleteRightsId === -1 && this.deleteUserId === -1) {
        return;
      }

      this.$message({
        type: 'info',
        message: '已取消删除',
      });
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role: any): Promise<any> {
      // @ts-ignore 获取所有权限数据 tree
      const result = (await this.$http.get('rights/tree')).data;
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }

      this.rightsList = result.data;

      this.getLefKeys(role, this.defKeys);

      this.rightRoleId = role.id;

      this.setRightDialogVisible = true;
    },
    // 通过递归获取角色下所有三级权限id
    getLefKeys(node: any, arr: any[]) {
      // 如果当前节点不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item: any) => {
        this.getLefKeys(item, arr);
      });
    },
    // 清空defKeys数组
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 为角色分配权限
    async allotRights(): Promise<any> {
      const keys: number[] = [
        // @ts-ignore
        ...this.$refs.treeRef.getCheckedKeys(),
        // @ts-ignore
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(',');

      const result = /* @ts-ignore */ (
        await this.$http.post(`roles/${this.rightRoleId}/rights`, {
          rids: idStr,
        })
      ).data;
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }

      this.$message.success(result.meta.msg);
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
});
</script>