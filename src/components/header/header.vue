<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="128" height="128" :src="seller.avatar" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="this.classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetailFn">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetailFn">
      <span class="bulletin-title"></span>
      <span class="bulletion-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="bg">
      <img :src="seller.avatar" width="100%" height="100%" alt="">
    </div>
    <transition name="fade">
      <div class="detail" v-show="showDetail" >
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <satr :size="48" :score="seller.score"></satr>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul class="supports" v-if="seller.supports">
            <li class="support-item" v-for="item in seller.supports">
              <span class="icon" :class="classMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <div class="content">{{seller.bulletin}}</div>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="closeDetail">
        <i class="icon-close"></i>
      </div>
    </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import satr from '../star/star.vue';
export default {
  props: {
    seller: {
      type: Object
    }
  },
  // 初始化数据
  data() {
    return {
      showDetail: false
    };
  },
  methods: {
    showDetailFn() {
      this.showDetail = true;
    },
    closeDetail() {
      this.showDetail = false;
    }
  },
  // 组件内部钩子函数 this当前的组件数据 使用this.classMap，它不是seller,是指当组件
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  components: {
    satr
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
 @import "../../common/stylus/mixin.styl"

.header
  color: #ffffff
  background: rgba(7,17,27,.5)
  position: relative
  overflow: hidden
  .content-wrapper
    padding :48px 24px 36px 48px
    font-size :0
    position: relative
    .avatar
      display :inline-block
      vertical-align: top
    .content
      display inline-block
      font-size:24px
      margin-left :32px
      .title
        margin :4px 0 16px 0
        .brand
          display :inline-block
          width :60px
          height: 36px
          bg-image("brand")
          vertical-align :top
        .name
          margin-left: 12px
          font-size: 32px
          line-height: 36px
          font-weight:bold
      .description
        margin-bottom: 20px
        line-height: 24px
        font-size: 24px
      .support
        .icon
          display: inline-block
          width: 24px
          height: 24px
          margin-right: 8px
          background-size :24px 24px
          background-repeat :no-repeat
          &.decrease
            bg-image("decrease_1")
          &.discount
            bg-image("discount_1")
          &.guarantee
            bg-image("guarantee_1")
          &.special
            bg-image("special_1")
          &.invoice
            bg-image("invoice_1")
    .support-count
      position: absolute;
      right: 24px
      bottom:28px
      padding:0 16px
      height: 48px
      line-height: 48px
      -webkit-border-radius: 24px
      -moz-border-radius: 24px
      border-radius: 24px
      background: rgba(0, 0, 0, .2)
      text-align: center
      .count
        vertical-align: top
        font-size: 20px
      .icon-keyboard_arrow_right
        margin-left:2px
        line-height:48px
        font-size:20px

  .bulletin-wrapper
    height: 56px
    line-height:56px
    padding:0 44px 0 24px
    font-size:0
    position: relative
    background-color: rgba(0,0,0,.2)
    .bulletin-title
      display: inline-block
      width: 44px
      height: 24px
      margin-top:16px
      bg-image('bulletin')
      vertical-align: top
      background-size :44px 24px
      background-repeat :no-repeat
    .bulletion-text
      margin:0 8px
      vertical-align: top
      font-size: 20px
      display: inline-block
      overflow: hidden
      white-space:nowrap
      -ms-text-overflow: ellipsis
      text-overflow: ellipsis
      width:calc(100% - 60px)
    .icon-keyboard_arrow_right
      position: absolute
      font-size:20px
      right: 12px
      top:16px
  .bg
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: -1
    filter:blur(10px)
  .detail
    position: fixed
    top: 0
    left:0
    z-index: 100
    width: 100%
    height: 100%
    overflow: auto
    transition:all .5s
    background-color: rgba(7,17,27,.8)
    -webkit-backdrop-filter:blur(10px)
    &.fade-transition
      opacity: 1
      background-color: rgba(7,17,27,.8)
    &.fade-enter,&.fade-leave
      opacity:0
      background-color: rgba(7,17,27,0)
    .detail-wrapper
      min-height: 100%
      width:100%
      .detail-main
        margin-top: 128px
        padding-bottom: 128px
        .name
          line-height: 32px
          text-align: center
          font-size: 32px
          font-weight:700
        .star-wrapper
          position: relative
          margin-top: 36px
          padding:4px 0
          text-align: center
         .title
           width: 80%
           display: flex
           margin:60px auto 48px auto
           /*父节点为flex，子节点就是伸缩项目，所以除了position的属性外，
            flex:1 就是自适应，会自动计算剩余空间然后分配
           */
           .line
             flex: 1
             position: relative
             top:-12px
             border-bottom:1px solid rgba(255,255,255,.2)
           .text
             padding:0 48px
             font-size: 28px
             font-weight:700
         .supports
           width: 80%
           margin: 0 auto
           .support-item
             padding:0 24px
             margin-bottom: 24px
             font-size: 0
             &:last-child
               margin: 0
             .icon
               display: inline-block
               width: 32px
               height: 32px
               vertical-align:top
               margin-right: 12px
               background-size:32px 32px
               background-repeat:no-repeat
               &.decrease
                 bg-image("decrease_2")
               &.discount
                 bg-image("discount_2")
               &.guarantee
                 bg-image("guarantee_2")
               &.special
                 bg-image("special_2")
               &.invoice
                 bg-image("invoice_2")
             .text
               line-height: 32px
               font-size: 24px
         .bulletin
           width: 80%
           margin:0 auto
           .content
             font-size:24px
             padding:0 24px
             line-height: 48px
    .detail-close
      margin:-128px auto 0
      position: relative
      width: 64px
      height: 128px
      clear: both
      font-size:64px


</style>
