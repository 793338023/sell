<template>
<div class="ratingselect">
  <div class="rating-type border-1px">
    <span class="block positive" @click="select(2,$event)" :class="{'active':rselectType==2}">{{desc.all}}<span class="count">{{rating.length}}</span></span>
    <span class="block positive" @click="select(0,$event)" :class="{'active':rselectType==0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
    <span class="block negative" @click="select(1,$event)" :class="{'active':rselectType==1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
  </div>
  <div class="switch" @click="toggleContent" :class="{'on':ronlyContent}">
    <span class="icon-check_circle"></span>
    <span class="text">只看有内容的评价</span>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
 const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      rating: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    data() {
      return {
        rselectType: this.selectType,
        ronlyContent: this.onlyContent
      };
    },
    methods: {
      select(type, ev) {
        if (!ev._constructed) {
          return false;
        }
        this.rselectType = type;
        this.$emit('rselect', type);
      },
      toggleContent(ev) {
        if (!ev._constructed) {
          return false;
        }
        this.ronlyContent = !this.ronlyContent;
        this.$emit('toggle', this.ronlyContent);
      }
    },
    computed: {
      positive() {
        return this.rating.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negative() {
        return this.rating.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingselect
    padding:36px 0px
    margin:0 36px
    border-1px(rgba(7, 17, 27, 0.1))
    font-size: 0
    .block
      display: inline-block
      padding:18px 24px
      margin-right:16px
      -webkit-border-radius: 1px
      -moz-border-radius: 1px
      border-radius: 1px
      font-size: 24px
      color:rgb(77, 85, 93)
      line-height:32px
      .count
        margin-left:4px
        font-size:16px
      &.active
        color:#fff
      &.positive
        background: rgba(0, 160, 220, 0.2)
      &.negative
        background: rgba(77, 85, 93, 0.2)
        &.active
          background:rgb(77, 85, 93)

  .switch
    padding:24px 0
    line-height: 48px
    border-bottom:1px solid rgba(7, 17, 27, 0.1)
    color:rgb(147, 153, 159)
    font-size: 0
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      font-size:48px
      marign-right:8px
      vertical-align: top
      display: inline-block
    .text
      display: inline-block
      vertical-align: top
      font-size: 24px

</style>
