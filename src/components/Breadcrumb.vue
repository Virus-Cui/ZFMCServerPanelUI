<template>
  <div class="navbar clearfix">
    <el-breadcrumb class="breadcrumb-container" separator-icon="CaretRight">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created(){
    this.getBreadcrumb()
  },
  methods:{
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0];
      this.levelList = matched
    }
  }
}
</script>

<style scoped>

</style>