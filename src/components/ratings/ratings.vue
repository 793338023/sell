<template>
  <div class="ratings" ref="rating">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-ratingselect :rating="ratings" :select-type="selectType" :only-content="onlyContent" @rselect="ratingselectTypeFn" @toggle="ratingtoggleFn"></v-ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img width="56" height="56" :src="rating.avatar" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{rating.usename}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {formatDate} from '../../common/js/date';
  import BScroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  const ALL = 2;
  const ERR_OK = 0;
  export default {
    props: {
      seller: Object
    },
    data() {
      return {
        ratings: [],
        showFlag: false,
        selectType: ALL,
        onlyContent: true
      };
    },
    created() {
      this.$http.get('/app/ratings').then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.ratings = res.data;
        }
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.rating, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      });
    },
    methods: {
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
      star,
      'v-split': split,
      'v-ratingselect': ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.ratings
  position: absolute
  top:348px
  bottom: 0
  width: 100%
  left: 0
  overflow: hidden
  .overview
    display: flex
    padding:36px 0px
    .overview-left
      flex:0 0 254px
      width:254px
      border-right:1px solid rgba(7, 17, 27, .1)
      text-align: center
      padding:12px 0
      @media screen and (max-width: 320px)
        flex:0 0 240px
        width:240px
      .score
        line-height:56px
        font-size: 48px
        color: rgb(255, 153, 0)
      .title
        line-height: 24px
        font-size: 24px
        color:rgb(7, 17, 27)
      .rank
        line-height: 20px
        font-size: 20px
        color: rgb(147, 153, 159)
    .overview-right
      flex:1
      padding:12px 0 12px 48px
      .score-wrapper
        margin-bottom: 16px
        font-size: 0
        .title
          font-size: 24px
          line-height:36px
          color: rgb(7, 17, 27)
        .star
          display: inline-block
          margin:0 24px
          vertical-align: top
        .score
          display:inline-block
          vertical-align: top
          line-height:36px
          font-size: 24px
          color: rgb(255, 153, 0)
      .delivery-wrapper
        font-size: 0
        .title
          line-height:36px
          font-size: 24px
          color: rgb(7, 17, 27)
        .delivery
          margin-left: 24px
          font-size: 24px
          color: rgb(147, 153, 159)
  .rating-wrapper
    padding:0 36px
    .rating-item
      display: flex
      padding:18px 0px
      border-1px(rgba(7, 17, 27, .1))
      .avatar
        flex:0 0 56px
        width: 56px
        margin-right: 24px
        img
          -webkit-border-radius: 50%
          -moz-border-radius: 50%
          border-radius: 50%
      .content
        position: relative
        flex:1
        .name
          margin-bottom:8px
          line-height: 24px
          font-size: 20px
          color: rgb(7, 17, 27)
        .star-wrapper
          margin-bottom: 12px
          font-size: 0
          .star
            display: inline-block
            margin-right:12px
            vertical-align: top
          .delivery
            display: inline-block
            vertical-align: top
            line-height: 24px
            font-size: 20px
            color: rgb(147, 153, 159)
        .text
          margin-bottom: 16px
          line-height: 36px
          color: rgb(7, 17, 27)
          font-size:24px
        .recommend
          line-height:32px
          font-size:0
          .icon-thumb_up ,.item
            display: inline-block
            margin:0 16px 8px 0px
            font-size: 18px
          .icon-thumb_up
            color:rgb(0, 160, 220)
          .item
            padding:0 12px
            border:1px solid rgba(7, 17, 27, .1)
            -webkit-border-radius: 1px
            -moz-border-radius: 1px
            border-radius: 1px
            color: rgb(147, 153, 159)
            background: #fff
        .time
          position: absolute
          top: 0
          right:0
          line-height:24px
          font-size: 20px
          color: rgb(7, 17, 27)
</style>
