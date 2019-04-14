<template>
<div class="cartcontrol">
  <transition name="move">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
  </transition>
  <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  <div class="cart-add icon-add_circle" @click.stop.prevent="addcart($event)"></div>
</div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
export default {
  props: {
    food: {
      type: Object
    },
    Hub: Object
  },
  created() {
    // console.log(this.food);
  },
  methods: {
    addcart(ev) {
      if (!ev._constructed) {
        return false;
      }
      if (!this.food.count) {
        // 使用vue的方法添加全局监听变量里
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      if (this.Hub) {
        this.Hub.$emit('change', ev.target);
      } else {
        this.$emit('increment', ev.target);
      }
    },
    decreaseCart(ev) {
      if (!ev._constructed) {
        return false;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
  font-size: 0
  .cart-decrease
    height:48px
    display: inline-block
    padding:6px
    -webkit-transition: all .4s linear
    -moz-transition:all .4s linear
    -ms-transition: all .4s linear
    -o-transition: all .4s linear
    transition: all .4s linear
    &.move-transition
      opacity: 1
      transform:translate3D(0, 0, 0)
    .inner
      line-height: 48px
      font-size:48px
      color: rgb(0, 160, 220)
      display: inline-block
      -webkit-transition: all .4s linear
      -moz-transition:all .4s linear
      -ms-transition: all .4s linear
      -o-transition: all .4s linear
      transition: all .4s linear
      transform:rotate(0);
    &.move-enter,&.move-leave
      opacity: 0
      transform:translate3D(24px, 0, 0)
      .inner
        transform:rotate(180deg);
  .cart-count
    display: inline-block
    line-height: 48px
    font-size:24px
    vertical-align:top
    width: 24px
    padding-top: 6px
    text-align: center
    color: rgb(147, 153, 159)
  .cart-add
    display: inline-block
    line-height: 48px
    font-size:48px
    padding:6px
    color: rgb(0, 160, 220)
</style>
