<template>
  <DynamicScroller
      :items="items"
      :min-item-size="54"
      class="scroller"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[
                        item.vouncherId,
                        item.totalPrice,
                        item.customerName,
                        item.dateTime,
                        item.id
                    ]"
          :data-index="index"
      >
        <div class="user">
          <span>{{index}}</span>
          <span>{{item.vouncherId}}</span>
          <span>{{item.totalPrice}}</span>
          <!--                    <span>{{item.customerName}}</span>-->
          <span>{{item.dateTime}}</span>
          <div class="d-flex">
            <router-link style="background-color: var(--live-bg); border-radius: var(--border-radius);" :to="{name:'Refund',params:{customer_id:item.customerId, voucher_id:item.id}}" class="btn border-0 btn-sm text-white">{{$t('message.refund')}} </router-link>
            <router-link style="background-color: var(--primary); border-radius: var(--border-radius);" :to="{name:'CustomerDetail',params:{customer_id:item.customerId, voucher_id:item.id}}" class="btn border-0 btn-sm text-white">{{$t('message.details')}}</router-link>

          </div>
        </div>

      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script>
export default {
  props: {
    items: Array,
  },
}
</script>

<style scoped>
.scroller {
  height: 100%;
}
.user {
  width: 100%;
  height: 20%;
  padding: 10px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--light);
}
.user span{
  width:200px;
  border-right: 2px solid var(--light);
  height: 40px;
  border-right: 2px solid var(--light);
  padding-left: 10px;
  margin:10px 5px;
}
</style>