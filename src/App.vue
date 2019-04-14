<template>
  <div id="app">
    <!--传值 需要把特定数据传到组件里-->
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <router-link  to="/goods" class="tab-item">商品</router-link>
      <router-link  to="/ratings" class="tab-item">评论</router-link>
      <router-link  to="/seller" class="tab-item">商品</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller" :Hub="Hub"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import {urlParse} from './common/js/util.js';
  import VueRouter from 'vue-router';
  import header from './components/header/header.vue';
  import goods from './components/goods/goods.vue';
  import ratings from './components/ratings/ratings.vue';
  import sellers from './components/seller/seller.vue';
  import Vue from 'vue';
  const ERR_OK = 0;
  let Hub = new Vue();
  // 添加到全局
  Vue.prototype.global = {};
  Vue.prototype.global.Hub = Hub;
  Vue.use(VueRouter);
  const routes = [
    // 首页重定向goods组件
    { path: '/', redirect: 'goods' },
    { path: '/goods', component: goods },
    { path: '/ratings', component: ratings },
    { path: '/seller', component: sellers }
  ];
  const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
  });
export default {
  name: 'app',
  components: {
    'v-header': header
  },
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    this.Hub = Hub;
    // 钩子函数
    this.$http.get('/app/seller?id=' + this.seller.id).then((rps) => {
      rps = rps.body;
      if (rps.errno === ERR_OK) {
        // 赋值给this 数据劫持 双向绑定
        this.seller = Object.assign({}, this.seller, rps.data);
      }
    });
  },
  router
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/base.styl"
@import "./common/stylus/mixin.styl"
@import "./common/style.css"
  .tab
    display flex
    width 100%
    height 80px
    line-height 80px
    border-bottom 2px solid rgba(7, 17, 27, 0.1)
    .router-link-active
      color: #ff7600
    .tab-item
      flex 1
      text-align center
      & > a
        display block
        font-size 24px
        color rgb(77, 85, 93)
        &.active
          color rgb(240 ,20, 20)
</style>
