<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight:totalCount>0}">
              <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
            </div>
            <div class="num" :class="{none:totalCount<=0}">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight:totalCount>0}">￥{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{seller.deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <div class="title">购物车</div>
            <div class="empty" @click="empty">清空</div>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="listMask">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import BetterScroll from 'better-scroll';
  export default {
    props: {
      seller: {
        type: Object,
        default: {}
      },
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      Hub: Object
    },
    data() {
      return {
        balls: [
          {
            show: false,
            name: 'ball1'
          },
          {
            show: false,
            name: 'ball2'
          },
          {
            show: false,
            name: 'ball3'
          },
          {
            show: false,
            name: 'ball4'
          },
          {
            show: false,
            name: 'ball5'
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    created() {
      var _this = this;
      this.Hub.$on('change', (target) => {
        _this.drop(target);
      });
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.bScroll) {
              this.bScroll = new BetterScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.bScroll.refresh();
            }
          });
        }
        return show;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.seller.minPrice}元起送`;
        } else if (this.totalPrice < this.seller.minPrice) {
          let diff = this.seller.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return `去结算`;
        }
      },
      payClass() {
        if (this.totalPrice < this.seller.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return false;
          }
        }
      },
      beforeEnter (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 64;
            let y = -(window.innerHeight - rect.top - 44);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.querySelector('.inner-hook');
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el, done) {
        /* eslint-disable no-unused-vars */
         let rf = el.offsetHeight;  // 为了重绘,不是可能没有动画效果
        this.$nextTick(() => {  // 异步
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.querySelector('.inner-hook');
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addListener('transitonend', done);
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return false;
        }
        this.fold = !this.fold;
      },
      empty() {
       this.selectFoods.forEach((food) => {
         food.count = 0;
       });
      },
      hideList() {
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.seller.minPrice) {
          return false;
        }
        alert(`结算￥${this.totalPrice}`);
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position: fixed
    bottom: 0
    left: 0
    z-index: 50
    width: 100%
    height: 96px
    .content
      display: flex
      background: #141d27
      font-size: 0
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -20px
          margin: 0 24px
          padding: 12px
          width: 112px
          height: 112px
          -webkit-box-sizing: border-box
          -moz-box-sizing: border-box
          box-sizing: border-box
          -webkit-border-radius: 50%
          -moz-border-radius: 50%
          border-radius: 50%
          vertical-align: top
          background: #141d27
          .logo
            width: 100%
            height: 100%
            -webkit-border-radius: 50%
            -moz-border-radius: 50%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 88px
              font-size: 48px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 48px
            height: 32px
            line-height: 32px
            text-align: center
            -webkit-border-radius: 32px
            -moz-border-radius: 32px
            border-radius: 32px
            font-size: 18px
            font-weight: 700
            color: #ffffff
            background: rgb(240, 20, 20)
            -webkit-box-shadow: 0 4px 0 rgba(0, 0, 0, .4)
            -moz-box-shadow: 0 4px 0 rgba(0, 0, 0, .4)
            box-shadow: 0 4px 0 rgba(0, 0, 0, .4)
            &.none
              display: none
        .price
          display: inline-block
          vertical-align: top
          margin-top: 24px
          line-height: 48px
          padding-right: 24px
          -webkit-box-sizing: border-box
          -moz-box-sizing: border-box
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 32px
          font-weight: 700
          color: rgba(255, 255, 255, 0.4)
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          line-height: 48px
          margin: 24px 0 0 24px
          font-size: 20px
          color: rgba(255, 255, 255, 0.4)
      .content-right
        flex: 0 0 210px
        width: 210px
        .pay
          height: 96px
          line-height: 96px
          text-align: center
          font-size: 24px
          color: rgba(255, 255, 255, 0.4)
          font-weight: 700
          background-color: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 64px
        bottom: 44px
        z-index: 200
        -webkit-transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        -moz-transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        -ms-transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        -o-transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        transition: all .6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 32 px
          height:32px
          border-radius:50%
          background: rgb(0, 160, 220)
          -webkit-transition: all 0.6s linear
          -moz-transition: all 0.6s linear
          -ms-transition: all 0.6s linear
          -o-transition: all 0.6s linear
          transition: all 0.6s linear
    .shopcart-list
      position:absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transition:all .5s
      transform: translate3d(0, -100%, 0)
      &.fold-enter,&.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height:80px
        line-height:80px
        padding:0 36px
        background:#f3f5f7
        border-bottom:1px solid rgba(7, 17, 27, 0.1)
        .title, .empty
          float:left
          font-size: 28px
          color:rgb(0, 160, 220)
        .empty
          float:right
      .list-content
        padding:0 36px
        max-height: 424px
        overflow:hidden
        background: #fff
        .food
          position: relative
          padding:24px 0px
          box-sizing:border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 28px
            font-size: 28px
            color:rgb(7, 17, 27)
          .price
            position: absolute
            right: 180px
            bottom:12px
            line-height: 48px
            font-size: 28px
            font-weight: 700
            color:rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    left: 0
    bottom: 0
    z-index:40
    width:100%
    height: 100%
    transition:all .5s
    opacity:1
    background: rgba(7, 17, 27, 0.6)
    backdrop-filter:blur(10px)
    &.listMask-enter, &.listMask-leave-active
      opacity: 0
      background:rgba(7, 17, 27, 0)

</style>
