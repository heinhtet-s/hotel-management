<template>
  <div class="modal mt-4">
    <div class="modal-card rounded shadow-lg" style="background-color: var(--light); color: var(--text-color);">
      <div class="card-body" >
        <div class="d-flex justify-content-between px-1 align-items-center rounded">
          <span class="fs-6 " id="exampleModalLabel">{{$t('message.cart_items')}}</span>
          <button class="btn rounded-pill" style="color: var(--text-color);" @click="closeModal"><i class="fas fa-times"></i></button>
        </div>

        <div class="cart-item-box" v-if="showCarts">
          <div class="row" >
            <div class="modal-body h-50">
              <div class="row">
                <div class="p-2 mb-1">
                  <div class="rounded-pill p-1 d-flex justify-content-between align-items-center">
                  </div>
                  <div class="card-body">
                    <div class="d-flex align-items-center justify-content-center">
                     <div>
                       <img :src="selectedItem.image" v-if="selectedItem.image" style="object-fit: cover; border-radius: var(--border-radius); width: 150px; height: 150px; border: 2px solid var(--light);" alt="">
                       <img src="../assets/flash/1.png" class="carousel-img" v-else alt="">
                     </div>

                      <div class="d-flex flex-column ps-2">
                        <span class="">{{ selectedItem.itemName }}</span>
                        <span class="">{{selectedItem.sellPrice}} Ks</span>
                        <span class="text-success ">{{ $t('message.cost') }}: {{selectedItem.totalPrice}} Ks</span>
                        <div class="d-flex bg-light rounded p-1 w-75 justify-content-between align-items-center">
                          <button class="btn btn-sm btn-dark" @click="decreaseCount">-</button>
                          <input class="form-control mx-1" v-model="selectedItem.count" @change="textChangeCount"/>
                          <button class="btn btn-sm btn-dark" @click="increaseCount">+</button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p>{{ $t('message.description') }}:</p>
                      <p>{{selectedItem.description}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-3">
              <form action="" class="text-center">
                <div class="text-start">
                  <label class="mb-1">{{ $t('message.message') }}</label>
                  <input type="text" required class="form-control" style="height: 40px;" v-model="orderMessage" placeholder="eg:color, size" >
                </div>
              </form>

            </div>
          </div>
        </div>

        <div class="cart-item-box" v-else>
          <!--          Notify box-->
          <div class="col-12 col-md-6 col-lg-4 mx-auto" v-if="showNextProcess">
            <div class="card ">
              <div class="car-body m-2 text-center">
                <i class="fas fa-bell fa-2x" style="color: var(--primary);"></i>
                <p class="fs-5">{{$t('message.these_rur_info')}}</p>
                <div class="d-flex flex-column text-start mx-auto">
                  <span><i class="fas fa-phone"></i>  {{user.phone}}</span>
                  <span><i class="fas fa-location-dot"></i>  {{user.address}}</span>
                </div>
                <div class="d-flex p-1 rounded mt-3 align-items-center ">
                  <button class="btn w-50 mx-auto" style="background-color: var(--light);" @click="showUpdateInfobox">{{$t('message.update_again')}}</button>
                  <!--                  <button class="btn w-50" style="background-color: var(&#45;&#45;btnLight);" @click="yesOption">Yes</button>-->

                </div>
              </div>
            </div>
          </div>
          <!--          Update Box -->
          <div class="col-12 col-md-6 col-lg-4 mx-auto" v-if="showUpdateBox">

            <div class="card mx-auto">
              <div class="car-body text-center">
                <i class="fas fa-bell fa-2x" style="color: var(--primary);"></i>
                <p class="fs-4">{{$t('message.update_info')}}</p>
                <div class="d-flex flex-column text-start m-3">
                  <span class="alert alert-warning text-black text-center" v-if="warningActive">{{warningMessage}}</span>

                  <label>{{ $t('message.phone') }}</label>
                  <div class="d-flex align-items-center rounded p-1" style="background-color: var(--btnLight);">
                    <span class="mx-1">09</span><input type="number" required class="form-control d-inline" v-model="updatePhone" id="online-input">
                  </div>
                  <label class="mt-3">{{ $t('message.address') }}</label>
                  <input type="text" class="form-control" v-model="updateAddress">
                  <!--                  <button class="btn w-50 mt-4 mx-auto" style="background-color: var(&#45;&#45;btnLight);" @click="updateInfo">Save</button>-->

                </div>
                <div class="d-flex p-1 rounded mt-3 w-50 mx-auto justify-content-between align-items-center ">
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4 col-md-6 mt-3 mx-auto"  v-if="loadingActive">
            <!--            Loading Box-->
            <Vue3Lottie :animationData="loadingCart" :height="150" :width="150" />

          </div>
          <div class="col-12 col-lg-4 col-md-6 mt-3 mx-auto px-2" >
            <!--            Success Box-->
            <div class="card mx-auto mt-3 py-5 px-2" v-if="successActive" style="background-color: var(--light);">
              <Vue3Lottie :animationData="orderSuccess" :height="200" :width="200" />

              <span class="fs-3">{{ modalMessage }} </span>
            </div>
          </div>


        </div>

        <div class="floating-btn rounded" :hidden="loadingActive">
          <div class="w-75 d-flex" v-if="successActive">
<!--            <button class="btn mx-auto w-50 text-light my-3" style="background-color: var(&#45;&#45;primary);" @click="closeModal" v-if="successActive">Close</button>-->
            <button class="btn mx-auto w-50 text-light my-3" style="background-color: var(--primary);" @click="closeModal" v-if="successActive">{{$t('message.check_order')}}</button>

          </div>
          <div class="w-75 d-flex" v-else>
            <button class="btn mx-auto w-50 text-light my-3" style="background-color: var(--primary);" @click="nextOrderProcess" v-if="showCarts"><span class="me-3">{{ $t('message.next') }}</span><i class="fas fa-chevron-right"></i></button>
            <button class="btn mx-auto me-2 w-50 text-light my-3" style="background-color: var(--primary);" @click="previousOrderProcess" data-bs-dismiss="modal" v-if="!showCarts"><i class="fas fa-chevron-left"></i><span class="ms-3">{{ $t('message.previous') }}</span></button>
            <button class="btn mx-auto me-2 w-50 text-light my-3" style="background-color: var(--primary);" @click="nextToDelivery" data-bs-dismiss="modal" v-if="!showUpdateBox && !showCarts">{{ $t('message.order_now') }}</button>
            <button class="btn mx-auto w-50 me-2 text-light my-3" style="background-color: var(--primary);" @click="nextAfterUpdate" data-bs-dismiss="modal" v-if="showUpdateBox">{{ $t('message.order_now') }}</button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const loadingCart = require('../assets/lotties/loading-cart.json')
const orderSuccess = require('../assets/lotties/OrderSuccess.json')
import db, {timestamp} from "@/config/FirebaseInit";
export default {
  props:['user','city','currentShop','liveId'],

  name:"AddToCart",
  data(){
    return{
      loadingCart,
      orderSuccess,
      orderIdToRoute:'',
      totalPrice:0,
      allTotal:[],
      deliveryServices:[],
      payment_methods:[],

      modalMessage:'',
      orderMessage:'',
      showPaymentToggle:false,
      showCityToggle:false,
      externalFeeRange:false,

      successActive:false,
      loadingActive:false,
      warningActive:false,
      warningMessage:'',
      showCarts:true,
      showUpdateBox:false,
      showDeliveryBox:false,
      showNextProcess:false,
      showOtherDeliInput:false,
      showOrderButton:false,
      selectedCity:'',
      selectedPaymentType:'',
      selectedDeliveryName:'',
      selectedDelivery:'',
      selectedDeliveryFeeRange:'',
      updatePhone:'',
      updateAddress:''
    }
  },
  computed:{
    selectedItem(){
      return this.$store.getters.getSelectedLiveItem;
    },
    orders(){
      return this.$store.getters.getCartItems;
    },
    cities(){
      return this.$store.getters.getCities;
    },
    today(){
      return this.$store.getters.getDay;
    },
    thisMonth(){
      return this.$store.getters.getMonth;
    },
    thisYear(){
      return this.$store.getters.getYear;
    },
    dateTime(){
      return this.$store.getters.getDateTime;
    }

  },
  mounted() {
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getYear");
    this.updateAddress = this.user.address;
    db.collection(this.currentShop.city).doc(this.currentShop.id).onSnapshot(snapshot=>{
      snapshot.data().deliveryServices.forEach(id=>{
        db.collection('deliveryServices').where('id','==',id).onSnapshot(snapshot=>{
          snapshot.forEach(doc=>{
            this.deliveryServices.push(doc.data())
          })
        })
      })
    });
    db.collection(this.currentShop.city).doc(this.currentShop.id).collection('paymentMethods').get().then(snapshot => {
      this.payment_methods=[];
      snapshot.forEach(doc=>{
        this.payment_methods.push(doc.data());
      });
    });
  },

  methods:{
    //radio click
    showDeliRangeByCity(city){
      this.showCityToggle = !this.showCityToggle;
      this.selectedCity = city;
      if(this.selectedDelivery!=='' && this.selectedCity!==''){
        if(this.selectedDelivery.availableCities.includes(this.selectedCity)){
          this.selectedDeliveryFeeRange = this.selectedDelivery.feeRange;
        }else {
          this.selectedDeliveryFeeRange = this.selectedDelivery.externalFeeRange;
        }
      }
      console.log(this.selectedDeliveryFeeRange)
    },

    choosePaymentType(type){
      this.selectedPaymentType =  type;
      this.showPaymentToggle = !this.showPaymentToggle;
    },
    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    async nextAfterUpdate(){
      if(this.updatePhone!=='' && this.updateAddress!==''){
        this.showUpdateBox = false;
        this.loadingActive = true;
        await db.collection('users').doc(this.user.id).update({
          'otherPhone':'+959'+this.updatePhone,
          'address':this.updateAddress
        }).then(()=>{
          this.confirm();
          this.showUpdateBox = false;
          this.showOrderButton = true;
        })
      }else {
        this.warningActive = true;

        this.warningMessage = this.$t('message.update_info_warning');
        setTimeout(()=>{
          this.warningActive = false;
        },5000)
      }
    },
    nextToDelivery(){
      if(this.user.phone!=='' || this.user.otherPhone!==''){
        //this.showDeliveryBox = true;
        this.showNextProcess = false;
        //this.showOrderButton = true;
        this.confirm();
      }else {
        this.warningMessage = this.$t('message.update_info_warning');
        setTimeout(()=>{
          this.warningActive = false;
        },5000)
      }

    },
    showUpdateInfobox(){
      this.showNextProcess = false;
      this.showUpdateBox = true;
    },

    nextOrderProcess(){
      this.showCarts = !this.showCarts;
      this.showNextProcess = true;
    },
    previousOrderProcess(){
      this.showCarts = true;
      this.showUpdateBox = false;
      //this.showDeliveryBox = false;
      this.showOrderButton = false;
      this.showNextProcess = false;
    },
    updateInfo(){
      db.collection('users').doc(this.user.id).update({
        'address':this.updateAddress,
        'otherPhone':this.updatePhone
      }).then(()=>{
        console.log('update ok');
        //this.showDeliveryBox = !this.showDeliveryBox;
      })
    },
    closeModal(){
      this.$emit("close-cart");
      this.$router.push({name:'CustomerLiveOrderDetails', params:{order_id:this.orderIdToRoute}});
    },
    removeFromCart(productId){
      console.log(productId)
      db.collection('users').doc(this.user.id).collection('cart').doc('shop').collection('items').doc(productId).delete();
    },
    getRandomStr(){
      const chars = "1234567890";
      let result = '';
      for ( let i = 0; i < 8; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    textChangeCount(){
      this.selectedItem.totalPrice = (parseInt(this.selectedItem.count)*parseInt(this.selectedItem.sellPrice)).toString()
    },
    increaseCount(){
      if(this.selectedItem.count<this.selectedItem.liveSaleCount){
        this.selectedItem.count++;
        this.selectedItem.totalPrice = (parseInt(this.selectedItem.count)*parseInt(this.selectedItem.sellPrice)).toString()
      }else {
        this.modalActive = true;
        this.modalMessage="Please decrease your count.";

      }

    },
    decreaseCount(){
      if(this.selectedItem.count>1){
        this.selectedItem.count--;
        this.selectedItem.totalPrice = (parseInt(this.selectedItem.count)*parseInt(this.selectedItem.sellPrice)).toString()
      }else {
        this.modalActive = true;
        this.modalMessage="Please Buy at least 1 item";
      }
    },
    async confirm(){
      this.loadingActive = true;
      let checkoutItem={
        'orderUserId':this.user.id,
        'orderStatus':'pending',
        'id':'',
        'count':this.selectedItem.count.toString(),
        'productId':this.selectedItem.productId,
        'discount':this.selectedItem.discount,
        'itemCode':this.selectedItem.itemCode,
        'liveSaleCount':this.selectedItem.liveSaleCount,
        'itemName':this.selectedItem.itemName,
        'buyPrice':this.selectedItem.buyPrice,
        'sellPrice':this.selectedItem.sellPrice.toString(),
        'image':this.selectedItem.image,
        'liveSessionId':this.liveId,
        'time':'',
        'day':'',
        'year':'',
        'dateTime':'',
        'statusDay':'',
        'statusDateTime':'',
        'promoCode':"0",
        'tax':"0",
        'totalPrice':this.selectedItem.totalPrice.toString(),
        'vouncherId':'',
        'message':this.orderMessage,
        'paymentType':this.selectedPaymentType,
        'transactionImg':'default',
        'deliveryServiceId':this.selectedDelivery.id || '',
        'deliveryServiceName':this.selectedDeliveryName,
        'cityToDeliver':this.selectedCity,
        'deliveryFeeRange':this.selectedDeliveryFeeRange
      }
      const orderDB = await db.collection(this.city).doc(this.currentShop.id).collection('liveOrders').doc();
      checkoutItem.id= orderDB.id;

      checkoutItem.month=this.thisMonth;
      checkoutItem.day =this.today;
      checkoutItem.statusDay = this.today;
      checkoutItem.year = this.thisYear;
      checkoutItem.dateTime = this.dateTime;
      checkoutItem.statusDateTime = this.dateTime;
      checkoutItem.time = timestamp;
      const liveProductsRef =  await db.collection(this.city).doc(this.currentShop.id).collection('liveSession').doc(this.liveId).collection('liveProducts').doc(checkoutItem.productId)
      return db.runTransaction((transaction) => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(liveProductsRef).then((sfDoc) => {
          if (sfDoc.exists) {
            let newCount = '';
            if (sfDoc.data().liveSaleCount >= parseInt(checkoutItem.count)) {
              newCount = parseInt(sfDoc.data().liveSaleCount) - parseInt(checkoutItem.count);
              transaction.update(liveProductsRef, {liveSaleCount: newCount.toString()});
            }else {
              //this.loadingActive = false;
              throw this.$t('message.live_order_cant')
            }
          }else {
            //this.loadingActive = false;
            throw this.$t('message.live_order_cant')
          }
        });
      }).then(() => {
        // console.log("Transaction successfully committed!");
        db.collection(this.city).doc(this.currentShop.id).collection('liveOrders').doc(orderDB.id).set(checkoutItem).then(() => {
          console.log('owner order added')
          let recordRef = db.collection(this.city).doc(this.currentShop.id).collection('liveOrders').doc(orderDB.id).collection('records').doc();
          recordRef.set({
            'statusDay':this.today,
            'statusDateTime':this.dateTime,
            'orderStatus':'pending',
            'id':recordRef.id,
            'time':timestamp,
          }).then(()=>{
            console.log('owner live record')
            db.collection('users').doc(this.user.id).collection('liveOrders').doc(orderDB.id).set({'shopId': this.currentShop.id,'shopCity':this.city, 'shopName': this.currentShop.name, ...checkoutItem})
                .then(() => {
                  console.log('user order added')
                  let userRecordRef = db.collection('users').doc(this.user.id).collection('liveOrders').doc(orderDB.id).collection('records').doc();
                  userRecordRef.set({
                    'statusDay':this.today,
                    'statusDateTime':this.dateTime,
                    'orderStatus':'pending',
                    'id':userRecordRef.id,
                    'time':timestamp,
                  }).then(()=> {
                    console.log('user live record')
                    this.orderIdToRoute = orderDB.id;
                    this.loadingActive = false;
                    this.modalActive = true;
                    this.successActive = true;
                    this.modalMessage=this.$t('message.order_success')
                  })

                });

          })

        });

      }).catch((error) => {
        this.loadingActive = false;
        this.successActive = true;
        this.modalMessage = error;
        // console.log("Transaction failed: ", error);
      });
    },

  },

}
</script>

<style scoped>
.modal{
  top:0;
  z-index: 5000;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.2);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-card{
  border-radius: var(--border-radius)!important;
  width: 70%;
  height: 88%;
  align-items: center;
  justify-content: center;
}
.cart-item-box{
  position: fixed;
  width: 65%;
  height: 70%;
  margin-top: 10px;
  padding-bottom: 100px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.floating-btn{
  border-radius: var(--border-radius);
  background-color: var(--side-bar-bg);
  position: fixed;
  width: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 30px;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@media screen and (max-width: 1000px){
  .floating-btn{
    bottom: 40px;
    width: 93%;
  }
}
@media screen and (max-width: 450px){
  .floating-btn{
    bottom: 30px;
    width: 88%;
  }
  .modal-card{
    width: 93%;
  }
  .cart-item-box{
    width: 88%;
  }
}

</style>