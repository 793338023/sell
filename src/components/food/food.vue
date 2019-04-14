<template>
  <transition name="foodmove">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="###">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="new">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <v-cartcontrol :food="food" :Hub="Hub"></v-cartcontrol>
          </div>
          <transition name="buymove">
            <div class="buy" @click="addFirst" v-show="!food.count || food.count==0">加入购物车</div>
          </transition>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <v-split></v-split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <v-ratingselect :rating="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc" @rselect="ratingselectTypeFn" @toggle="ratingtoggleFn"></v-ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px" v-for="rating in food.ratings">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img width="24" height="24" :src="rating.avatar" alt="">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/js/date';
  import Vue from 'vue';
  const ALL = 2;
export default {
  props: {
    food: Object,
    Hub: Object
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
        }
      };
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(ev) {
      if (!ev._constructed) {
        return false;
      }
      Vue.set(this.food, 'count', 1);
      this.Hub.$emit('change', ev.target);
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    },
    ratingselectTypeFn(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    ratingtoggleFn(oContent) {
      this.onlyContent = oContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    }
  },
  filters: {
    formatDate(time) {
      return formatDate(new Date(time), 'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    'v-cartcontrol': cartcontrol,
    'v-split': split,
    'v-ratingselect': ratingselect
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.food
  position:fixed
  left: 0
  top: 0
  bottom: 96px
  z-index:30
  width:100%
  background-color: #fff
  transition:all .2s linear
  &.foodmove-enter, &.foodmove-leave-active
    transform:translate3d(100%, 0, 0)
  .image-header
    width: 100%
    padding-top: 100%
    position: relative
    height: 0
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 20px
      left:0
      .icon-arrow_lift
        display: block
        padding: 20px
        font-size: 40px
        color: #fff
  .content
    position: relative
    padding: 36px
    .title
      line-height: 28px
      margin-bottom: 16px
      font-size: 28px
      font-weight: 700
      color: rgb(7, 17, 27)
    .detail
      margin-bottom: 36px
      line-height: 20px
      font-size: 0
      height: 20px
      .sell-count, .rating
        font-size: 20px
        color: rgb(147, 153, 159)
      .sell-count
        margin-right: 24px
    .price
      font-weight: 700
      line-height:48px
      .new
        margin-right: 16px
        font-size: 28px
        color:rgb(240, 40, 40)
      .old
        text-decoration: line-through
        font-size: 20px
        color:rgb(147, 153, 159)
  .info
    padding: 36px
    .title
      line-height: 28px
      margin-bottom: 12px
      font-size: 28px
      color:rgb(7, 17, 27)
    .text
      line-height: 48px
      padding:0 16px
      font-size:  24px
      color: rgb(77, 85, 93)
  .cartcontrol-wrapper
    position: absolute
    right: 29px
    bottom: 29px
  .buy
    position: absolute
    right: 36px
    bottom: 36px
    z-index: 10
    height: 48px
    line-height: 48px
    padding:0 24px
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box
    -webkit-border-radius: 12px
    -moz-border-radius: 12px
    border-radius: 24px
    font-size: 20px
    color: #fff
    background: rgb(0, 160, 220)
    transition:all .3s
    opacity:1
    &.buymove-enter, &.buymove-leave-active
      opacity: 0
  .rating
    padding-top: 36px
    .title
      line-height: 28px
      margin-left: 12px
      font-size: 28px
      color:rgb(7, 17, 27)
    .rating-wrapper
      padding:0 36px
      .rating-item
        position: relative
        padding:32px 0px
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position: absolute
          right: 0
          top:32px
          font-size:0
          line-height:24px
          .name
            display: inline-block
            margin-right: 12px
            vertical-align: top
            font-size:20px
            color: rgb(147, 153, 159)
          .avatar
            border-radius:50%
        .time
          margin-bottom: 12px
          line-height: 24px
          font-size:20px
          color: rgb(147, 153, 159)
        .text
          line-height:32px
          font-size: 24px
          color: rgb(7, 17, 27)
        .icon-thumb_up, .icon-thumb_down
          margin-right: 8px
          line-height:32px
          font-size: 24px
        .icon-thumb_up
          color:rgb(0, 160, 220)
        .icon-thumb_down
          color:rgb(147, 153, 159)

      .no-rating
        padding:32px 0px
        font-size: 24px
        color:rgb(147, 153, 159)
</style>
