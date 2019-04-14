<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrap">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{current:currentIndex==index }" @click="selectMenu(index, $event)">
          <span class="title">
            <span class="text border-1px">
              <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrap">
      <ul>
        <li class="food-list food-list-hook" v-for="item in goods">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item border-1px" @click="selectFoodx(food,$event)" v-for="food in item.foods">
              <div class="icon">
                <img width="114"  :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="new">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol :food="food" @increment="incrementTotal"></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <v-shopcart :selectFoods="selectFood" :seller="seller" ref="shopCart" :Hub="Hub"></v-shopcart>
    <v-food :food="selectedFood" :Hub="Hub" ref="foodVue" ></v-food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart.vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import food from '../food/food.vue';
  const ERR_OK = 0;
export default {
  props: {
    seller: Object,
    Hub: Object
  },
  data() {
    return {
      goods: [],
      listHeihgt: [],
      scrollY: 0,
      lastHeight: 0,
      selectedFood: {}
    };
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    this.$http.get('app/goods').then(function(rps) {
      rps = rps.body;
      if (rps.errno === ERR_OK) {
        this.goods = rps.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeihgt.length; i++) {
        let h1 = this.listHeihgt[i];
        let h2 = this.listHeihgt[i + 1];
        if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {
          return i;
        }
      }
      if (this.lastheight <= this.scrollY) {
        return this.listHeihgt.length - 2;
      }
      return 0;
    },
    selectFood() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((f) => {
          if (f.count) {
            foods.push(f);
          }
        });
      });
      return foods;
    }
  },
  methods: {
    _initScroll() {
      this.meunScroll = new BetterScroll(this.$refs.menuWrap, {
        click: true
      });
      this.foodScroll = new BetterScroll(this.$refs.foodWrap, {
        click: true,
        // 开始实时监听滚动
        probeType: 3
      });
      this.foodScroll.on('scroll', (pos) => {
        let scrollY = Math.abs(Math.ceil(pos.y));
        this.scrollY = scrollY;
      });
    },
    _calculateHeight() {
      let foodList = this.$refs.foodWrap.querySelectorAll('.food-list-hook');
      let height = 0;
      this.listHeihgt.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.offsetHeight;
        this.listHeihgt.push(height);
      }
      this.lastheight = height;
    },
    selectMenu(index, ev) {
      if (!ev._constructed) {
        return false;
      }
      let foodItem = this.$refs.foodWrap.querySelectorAll('.food-list-hook')[index];
      this.foodScroll.scrollToElement(foodItem, 500, 0, 2);
    },
    incrementTotal(target) {
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target);
      });
    },
    selectFoodx (food, ev) {
      if (!ev._constructed) {
        return false;
      }
      this.selectedFood = food;
      this.$refs.foodVue.show();
    }
  },
  components: {
    'v-shopcart': shopcart,
    'v-cartcontrol': cartcontrol,
    'v-food': food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
.goods
  display: flex
  position: absolute
  top: 348px
  bottom: 92px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex:0 0 160px
    width: 160px
    background: #f3f5f7
    .menu-item
      display: table
      width: 100%
      height:112px
      line-height:28px
      font-size:24px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background-color: #fff
        font-weight: 700
        .text
          border:none
      .text
        display: table-cell
        vertical-align: middle
        width: 112px
        padding:0 24px
        height:112px
        border-1px(rgba(7, 17, 27, .1))
      .icon
        display: inline-block
        width: 24px
        height: 24px
        margin-right: 8px
        background-size :24px 24px
        background-repeat :no-repeat
        &.decrease
          bg-image("decrease_3")
        &.discount
          bg-image("discount_3")
        &.guarantee
          bg-image("guarantee_3")
        &.special
          bg-image("special_3")
        &.invoice
          bg-image("invoice_3")
  .foods-wrapper
    flex:1
    .title
      padding-left: 28px
      height: 52px
      line-height: 52 px
      border-left:2px solid #d9dde1
      font-size: 24px
      color:rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 36px
      padding-bottom: 36px
      border-1px(rgba(7, 17,  27, .1))
      &:last-child
        border-bottom:none
        margin-bottom: 0
      .icon
        flex:0 0 114px
        width: 114px
        margin-right: 20px
      .content
        flex: 1
        .name
          margin:4px 0 16px 0px
          height: 24px
          line-height:24px
          font-size: 24px
          color:rgb(7, 17, 27)
        .desc, .extra
          line-height: 20px
          font-size: 20px
          color:rgb(147, 153, 159)
        .desc
          margin-bottom: 16px
        .extra
          &.count
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

        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom:24px
</style>
