<template>
<div class="seller" ref="seller">
  <div class="seller-content">
    <div class="overview">
      <h1 class="title">{{seller.name}}</h1>
      <div class="desc">
        <star :size="36" :score="seller.score"></star>
        <span class="text">({{seller.ratingCount}})</span>
        <span class="text">月售{{seller.sellCount}}单</span>
      </div>
      <ul class="remark">
        <li class="block">
          <h2>起送价</h2>
          <div class="content">
            <span class="stress">{{seller.minPrice}}</span>元
          </div>
        </li>
        <li class="block">
          <h2>商家配送</h2>
          <div class="content">
            <span class="stress">{{seller.deliveryPrice}}</span>元
          </div>
        </li>
        <li class="block">
          <h2>平均配送时间</h2>
          <div class="content">
            <span class="stress">{{seller.deliveryTime}}</span>分钟
          </div>
        </li>
      </ul>
      <div class="favorite" >
        <span class="icon-favorite" :class="{'active':favorite}" @click="toggleFavorite"></span>
        <span class="text">{{favoriteText}}</span>
      </div>
    </div>
    <split></split>
    <div class="bulletin">
      <h1 class="title">公告与活动</h1>
      <div class="content-wrapper border-1px">
        <p class="content">{{seller.bulletin}}</p>
      </div>
      <ul v-if="seller.supports" class="supports">
        <li class="support-item border-1px" v-for="(item,index) in seller.supports">
          <span class="icon" :class="classMap[seller.supports[index].type]"></span>
          <span class="text">{{seller.supports[index].description}}</span>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="pics">
      <h1 class="title">商家实景</h1>
      <div class="pic-wrapper" ref="picWrapper">
        <ul class="pic-list" ref="picList">
          <li class="pic-item" v-for="pic in seller.pics">
            <img :src="pic" width="240" height="180">
          </li>
        </ul>
      </div>
    </div>
    <split></split>
    <div class="info">
      <h1 class="title border-1px">商家信息</h1>
      <ul>
        <li class="info-item" v-for="info in seller.infos">{{info}}</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import star from '../star/star.vue';
import split from '../split/split';
import {saveTocal, loadFromLocal} from '../../common/js/store';
  export default {
    props: {
      seller: Object
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '未收藏';
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: {
      'seller'() {
        this.$nextTick(() => {
          this._initScoll();
          this._initPics();
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initScoll();
        this._initPics();
      });
    },
    methods: {
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveTocal(this.seller.id, 'favorite', this.favorite);
      },
      _initScoll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics() {
        if (this.seller.pics) {
          let picWidth = 240;
          let margin = 12;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .seller
    position: absolute
    top: 348px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 36px
      .title
        margin-bottom: 16px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 28px
      .desc
        padding-bottom: 36px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .star
          display: inline-block
          margin-right: 16px
          vertical-align: top
        .text
          display: inline-block
          margin-right: 24px
          line-height: 36px
          vertical-align: top
          font-size: 20px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 36px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border: none
          h2
            margin-bottom: 8px
            line-height: 20px
            font-size: 20px
            color: rgb(147, 153, 159)
          .content
            line-height: 48px
            font-size: 20px
            color: rgb(7, 17, 27)
            .stress
              font-size: 48px
      .favorite
        position: absolute
        width: 100px
        right: 22px
        top: 36px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 8px
          line-height: 48px
          font-size: 48px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .text
          line-height: 20px
          font-size: 20px
          color: rgb(77, 85, 93)
    .bulletin
      padding: 36px 18px 0 18px
      .title
        margin-bottom: 16px
        line-height: 28px
        color: rgb(7, 17, 27)
        font-size: 28px
      .content-wrapper
        padding: 0 24px 32px 24px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height: 48px
          font-size: 24px
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 32px 24px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 0
          &:last-child
            border-none()
        .icon
          display: inline-block
          width: 32px
          height: 32px
          vertical-align: top
          margin-right: 12px
          background-size: 32px 32px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height: 32px
          font-size: 24px
          color: rgb(7, 17, 27)
    .pics
      padding: 36px
      .title
        margin-bottom: 24px
        line-height: 28px
        color: rgb(7, 17, 27)
        font-size: 28px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 12px
            width: 240px
            height: 180px
            &:last-child
              margin: 0
    .info
      padding: 36px 36px 0 36px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 24px
        line-height: 28px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 28px
      .info-item
        padding: 32px 24px
        line-height: 32px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 24px
        &:last-child
          border-none()
</style>
