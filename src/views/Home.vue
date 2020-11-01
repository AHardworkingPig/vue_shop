<template>
  <section class="home">
    <el-container class="home-container">
      <el-header>
        <div class="logo">
          <img src="../assets/images/logo.png" alt="logo" />
          <span>Vue电商后台管理系统</span>
        </div>
        <el-button @click="logout" type="info" round>退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside
          :width="isCollapse ? '64px' : '220px'"
          class="home-aside-style"
        >
          <!-- 折叠 -->
          <el-button type="text" class="toggle-btn" @click="toggleCollapse"
            >&lt; &gt;</el-button
          >
          <el-menu
            background-color="#263238"
            text-color="#ffffff"
            active-text-color="#2196F3"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
            ref="menu"
          >
            <el-submenu
              :index="item.id.toString()"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <i
                  :class="[
                    iconsObj[item.id.toString()],
                    { 'c-mini': isCollapse },
                  ]"
                ></i>
                <span>{{ item.authName }}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </section>
</template>

<style lang="scss" scoped>
.home {
  height: 100%;

  .home-container {
    height: 100%;

    .el-header {
      background-color: #263238;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 5px;
      padding-right: 5px;

      .logo {
        height: 100%;
        display: flex;
        align-items: center;

        img {
          width: 40px;
          height: 40px;
        }

        span {
          margin-left: 5px;
          color: rgb(255, 255, 255);
          letter-spacing: 1px;
          font-size: 18px;
        }
      }
    }

    .home-aside-style {
      background-color: #263238;
      height: calc(100vh - 60px);
      overflow-x: hidden;
      overflow-y: auto;

      .toggle-btn {
        width: 100%;
        color: rgba(255, 255, 255, 0.8);
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: rgb(255, 255, 255);
        }
      }

      .el-menu {
        border-right: none;

        .el-submenu__title {
          span {
            margin-left: 8px;
          }
        }
      }
    }

    .el-main {
      background-color: ghostwhite;
      max-height: calc(100vh - 60px);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}

// 图标样式
[class^='el-icon-'],
[class*='icon-'] {
  color: rgba(255, 255, 255, 0.8);

  // collapse缩小时保持居中
  &.c-mini {
    margin-left: 3px;
  }
}
</style>

<style lang="scss">
// 改变list arrow 样式
.home-aside-style {
  .el-submenu__title {
    .el-submenu__icon-arrow {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data: () => ({
    // 左侧菜单数据
    menulist: [],
    // 图标
    iconsObj: {
      125: 'iconfont icon-user',
      103: 'iconfont icon-tijikongjian',
      101: 'iconfont icon-shangpin',
      102: 'iconfont icon-danju',
      145: 'iconfont icon-baobiao',
    },
    // 是否折叠menu
    isCollapse: false,
    // 被激活的地址
    activePath: '',
    subMenuId: '',
  }),
  created() {
    this.getMenuList();
    // @ts-ignore
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    // 获取所有菜单
    async getMenuList(): Promise<any> {
      // @ts-ignore
      const result = (await this.$http.get('menus')).data;
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg);
      }

      this.menulist = result.data;
    },
    // 折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存导航状态
    saveNavState(activePath: string) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;

      // 保存subItem id
      this.menulist.forEach((value) => {
        // @ts-ignore
        if ('/' + value.path === activePath) {
          // @ts-ignore
          this.subMenuId = value.id.toString();
        }
      });
    },
  },
});
</script>