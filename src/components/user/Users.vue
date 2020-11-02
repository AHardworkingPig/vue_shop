<template>
  <section class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="u-card" :body-style="{ padding: 0 }">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6"
          ><el-button
            type="primary"
            class="addUser-btn"
            @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
    </el-card>

    <!-- 用户列表区 -->
    <el-table :data="userList" border>
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="174">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-tooltip
            content="修改"
            placement="top"
            effect="light"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
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
              @click="showDeleteDialog(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <!-- 分配角色 -->
          <el-tooltip
            content="分配角色"
            placement="top"
            effect="light"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRole(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="users-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
        ref="addFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
        ref="editFormRef"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除用户的对话框 -->
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
        ><i class="el-icon-warning"></i><span>你确定要删除此用户吗?</span></span
      >

      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="deleteUserById" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          分配角色：<el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<style lang="scss" scoped>
.users {
  .u-card {
    margin-top: 30px;
    margin-bottom: 30px;
    box-shadow: none;
    background-color: transparent;
    border: none;

    .addUser-btn {
      float: right;
    }
  }

  .users-pagination {
    margin-top: 20px;
    margin-bottom: 20px;
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

<style lang="scss">
.users-pagination {
  button {
    background-color: transparent !important;
  }

  .el-pager {
    li {
      background-color: transparent !important;
    }
  }
}

.delete-dialog {
  .el-dialog__body {
    padding: 10px 20px !important;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => {
    // 邮箱验证
    const checkEmail = (
      rule: string,
      value: string,
      // tslint:disable-next-line
      cb: (err?: Error) => void
    ) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        //   合法
        return cb();
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'));
    };
    // 验证手机号
    const checkMobile = (
      rule: string,
      value: string,
      // tslint:disable-next-line
      cb: (err?: Error) => void
    ) => {
      const regMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'));
    };

    return {
      // 获取用户列表参数
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 添加用户对话框是否显示
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加表单验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 修改用户对话框是否显示
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改用户验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 删除用户对话框是否显示
      deleteDialogVisible: false,
      // 要删除的用户id
      deleteUserId: 0,
      // 分配角色对话框是否显示
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色数据列表
      rolesList: [],
      // 选中的角色id
      selectedRoleId: '',
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList(): Promise<any> {
      // @ts-ignore
      const result = (await this.$http.get('users', { params: this.queryInfo }))
        .data;

      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }
      this.userList = result.data.users;
      this.total = result.data.total;
    },
    // 监听pagesize改变
    handleSizeChange(newSize: number) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变
    handleCurrentChange(newPage: number) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch 状态改变
    async userStateChanged(userinfo: any): Promise<any> {
      const result = ( // @ts-ignore
        await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      ).data;

      if (result.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error(result.meta.msg);
      }

      this.$message.success(result.meta.msg);
    },
    // 添加用户对话框关闭时的事件
    addDialogClosed() {
      // @ts-ignore
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      // @ts-ignore
      this.$refs.addFormRef.validate(async (value) => {
        if (!value) {
          // 没有通过验证
          return;
        }

        // @ts-ignore
        const result = (await this.$http.post('users', this.addForm)).data;

        if (result.meta.status !== 201) {
          return this.$message.error(result.meta.msg);
        }

        this.$message.success(result.meta.msg);
        // 关闭
        this.addDialogVisible = false;
        // 重新获取用户数据
        this.getUserList();
      });
    },
    // 显示修改用户对话框
    async showEditDialog(id: number) {
      this.editDialogVisible = true;

      // @ts-ignore
      const result = (await this.$http.get(`users/${id}`)).data;

      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }

      this.editForm = result.data;
    },
    // 修改用户关闭事件
    editDialogClosed() {
      // @ts-ignore 重置
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息
    editUserInfo() {
      // @ts-ignore
      this.$refs.editFormRef.validate(async (value) => {
        if (!value) {
          // 没有通过验证
          return;
        }

        const result = /* @ts-ignore */ (
          await this.$http.put(`users/${this.editForm.id}`, {
            // @ts-ignore
            email: this.editForm.email,
            // @ts-ignore
            mobile: this.editForm.mobile,
          })
        ).data;

        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg);
        }

        this.$message.success(result.meta.msg);
        // 关闭
        this.editDialogVisible = false;
        // 重新获取用户数据
        this.getUserList();
      });
    },
    // 删除用户
    async deleteUserById() {
      const result = /* @ts-ignore */ (
        await this.$http.delete(`users/${this.deleteUserId}`)
      ).data;

      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }

      // 防止删除成功还显示撤销删除消息
      this.deleteUserId = -1;

      this.deleteDialogVisible = false;

      this.getUserList();

      this.$message.success(result.meta.msg);
    },
    // 保存要删除的用户id和打开删除框
    showDeleteDialog(id: number) {
      this.deleteDialogVisible = true;
      this.deleteUserId = id;
    },
    // 删除用户关闭去前的回调
    deleteDialogClosed() {
      if (this.deleteUserId === -1) {
        return;
      }

      this.$message({
        type: 'info',
        message: '已取消删除',
      });
    },
    // 设置角色
    async setRole(userInfo: any): Promise<any> {
      this.userInfo = userInfo;

      // @ts-ignore 获取所有角色列表
      const result = (await this.$http.get('roles')).data;

      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }

      this.rolesList = result.data;

      this.setRoleDialogVisible = true;
    },
    // 分配角色
    async saveRoleInfo(): Promise<any> {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择角色！');
      }

      const result = /* @ts-ignore */ (
        await this.$http.put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId,
        })
      ).data;

      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }

      this.$message.success(result.meta.msg);

      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 分配角色对话框关闭后
    setRoleDialogClosed() {
      this.selectedRoleId = '';
      this.userInfo = {};
    },
  },
});
</script>