<template>
  <div class="container-xxl pt-5" style="background-color: var(--background-color);color: var(--text-color);" >
    <div class="row mt-4">
      <div class="col-12 col-lg-4 mx-auto profile-box">
       <div class="d-flex justify-content-between align-items-center">
         <button class="btn fs-5 fw-bold p-1" @click="$router.back()"><i class="fas fa-chevron-left"></i> {{$t('message.profile')}}</button>
         <button v-if="user" style="background-color: var(--side-bar-bg); color: var(--text-color);" class="btn shadow-sm btn-sm rounded" @click="signOut">{{$t('message.logout')}}</button>
       </div>
        <div class="card profile-box">
          <div class="card-body text-center">
            <img :src="user.photo" class="rounded mb-2" style="width: 100px;height: 100px;object-fit: cover" v-if="user.photo!==''" alt="">
            <img src="../assets/flash/5.png" class="rounded mb-2" style="width: 100px;height: 100px;object-fit: cover" v-else alt="">
            <div class="rounded text-start d-inline mt-3">
              <form action="">
                <input type="file"  required @change="onChangePhotoInput" accept="image/*" id="img-input" class="form-control d-inline">
                <label class="form-label">{{$t('message.phone')}}: </label>
                <input disabled type="text" v-model="user.phone" class="form-control">
                <label class="form-label">{{ $t('message.email') }}: </label>
                <input disabled type="text" required class="form-control" v-model="user.email">
                <label class="form-label">{{$t('message.name')}}: </label>
                <input type="text" required class="form-control" v-model="user.name">
                <label class="form-label">{{ $t('message.address') }} : </label>
                <input type="text" required class="form-control" v-model="user.address">
                <button style="background-color: var(--side-bar-bg); color: var(--text-color);" class="btn my-2 btn-sm float-end" @click.prevent="updateInfo">{{$t('message.update')}}</button>
              </form>
            </div>

          </div>
        </div>
      </div>
      <div class="col-12 col-lg-8 rounded order-col" style="height:85vh;">
        <div class="row" >
          <div class="btn-group rounded p-1" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" @click="chooseOrder" name="btnradio" id="btnradio1" autocomplete="off" checked>
            <label class="btn btn-outline-primary" style="font-size: 12px;" :class="orderActive?'check-btn':''"  for="btnradio1">{{$t('message.orders')}}</label>

            <input type="radio" class="btn-check" @click="chooseLiveOrder" name="btnradio" id="btnradio2" autocomplete="off">
            <label class="btn btn-outline-primary " style="font-size: 12px;" :class="!orderActive?'check-btn':''" for="btnradio2">{{$t('message.live_orders')}}</label>
          </div>
        </div>
        <div  class="row mx-auto order-box" v-if="liveOrderActive">
          <div class="col-12 col-lg-6 col-md-6 align-items-start p-0" v-for="record in liveRecords" :key="record.id">
            <div class="card p-1">
              <div class="p-2 d-flex justify-content-between align-items-center">
                <span class="badge rounded-pill bg-danger" v-if="record.orderStatus==='cancelled'">{{$t('message.cancel')}}</span>
                <span class="badge rounded-pill bg-success" v-else-if="record.orderStatus==='confirmed'">{{$t('message.confirm')}}</span>
                <span class="badge rounded-pill bg-primary" v-else-if="record.orderStatus==='paid'">{{$t('message.paid')}}</span>
                <span class="badge rounded-pill bg-warning text-white" v-else>{{$t('message.pending')}}</span>
                <router-link class=" w-50 text-truncate text-end" :to="{name:'ShopInfo',params:{city:record.shopCity,shop_name:record.shopName.split(' ').join('-'),product_type:'All'}}">{{record.shopName}}</router-link>
              </div>
              <div class="card-body p-0 d-flex flex-column">
                <div class="d-flex my-1 align-items-center">
                  <i class="fas fa-clock"></i><span> {{record.time.toDate().toLocaleDateString()}}, {{record.time.toDate().toLocaleTimeString()}}</span>
                </div>
                <span class="">{{$t('message.order_id')}}: {{record.id}}</span>
                <div class="d-flex w-100 align-items-center">
                  <img :src="record.image" class="shadow-sm rounded" style="width: 100px; height: 100px" alt="">
                  <div class="d-flex mx-2 flex-column">
                    <span class="text-truncate">{{record.itemName}}</span><!--
                    <span>{{ $t('message.user_sellPrice') }}: {{record.sellPrice}}</span>
                    <span>{{ $t('message.count') }}: {{record.count}}</span>-->
                    <span>{{$t('message.total_price')}}: {{record.totalPrice}}</span>
                  </div>
                </div>
                <router-link :to="{name:'CustomerLiveOrderDetails', params:{order_id:record.id}}" style="background-color: var(--primary); color:white;" class="btn btn-sm mt-1">{{$t('message.view_details')}}</router-link>

              </div>
            </div>
          </div>
        </div>
        <div class="row mx-auto order-box" v-else>
          <div class="col-12 col-lg-6 col-md-6 align-items-start p-0" v-for="record in records" :key="record.id">
            <div class="card p-1" >
              <div class="p-2 d-flex justify-content-between align-items-center">
                <span class="badge rounded-pill bg-danger" v-if="record.orderStatus==='cancelled'">{{$t('message.cancel')}}</span>
                <span class="badge rounded-pill bg-success" v-else-if="record.orderStatus==='confirmed'">{{$t('message.confirm')}}</span>
                <span class="badge rounded-pill bg-primary" v-else-if="record.orderStatus==='paid'">{{$t('message.paid')}}</span>
                <span class="badge rounded-pill bg-warning text-white" v-else>{{$t('message.pending')}}</span>
                <router-link class="w-50 text-truncate text-end" :to="{name:'ShopInfo',params:{city:record.shopCity,shop_name:record.shopName.split(' ').join('-'),product_type:'All'}}">{{record.shopName}}</router-link>

<!--                <span class="badge rounded-pill text-dark" :class="record.orderStatus==='pending'?'bg-warning':'bg-success'">{{record.orderStatus}}</span>-->
              </div>
              <div class="card-body">
                <span class="text-black-50"> <i class="fas fa-clock"></i>  {{record.time.toDate().toLocaleDateString()}}, {{record.time.toDate().toLocaleTimeString()}}</span>
                <p style="font-size: 12px; color: var(--text-color-light);">{{$t('message.order_id')}}: {{record.id}}</p>
                <div class="d-flex card-body scroll-order">
                  <div v-for="(image,index) in record.images" class="m-1" :key="index">
                    <img :src="image" class="shadow-sm rounded-circle shadow-sm" style="width: 30px; height: 30px" alt="">
                  </div>

<!--                  <ul class="list-unstyled">
                    <li v-for="(name,index) in record.nameList" :key="index">
                      <span class="badge" style="background-color: var(&#45;&#45;side-bar-bg);">{{name}}</span>
                    </li>
                  </ul>
                  <ul class="list-unstyled">
                    <li v-for="(price,index) in record.sellPriceList" class="li-normal" :key="index">
                      {{price}}
                    </li>
                  </ul>

                  <ul class="list-unstyled">
                    <li v-for="(count,index) in record.countList" class="li-normal" :key="index">
                      x{{count}}
                    </li>
                  </ul>-->

                </div>
                <p>{{ $t('message.total_price') }}: {{record.totalPrice}}</p>
                <router-link :to="{name:'CustomerOrderDetails', params:{order_id:record.id}}" style="background-color: var(--primary); color: white;" class="btn btn-sm float-end">{{$t('message.view_details')}}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import db from '../config/FirebaseInit';
import "firebase/compat/auth";
export default {
  name:'UserProfile',
  data(){
    return{
      records:[],
      liveRecords:[],
      orderActive:true,
      liveOrderActive:false,
    }

  },
  created() {
    this.$store.dispatch('getCurrentUser');
  },
  computed:{
    user(){
      return this.$store.getters.getCurrentUser;
    },
  },
  async mounted() {
    await db.collection('users').doc(this.user.id).collection('orders').orderBy("time","desc").onSnapshot(snapshot => {
      this.records = [];
      snapshot.forEach(doc=>{
        this.records.push(doc.data());
      });
      //console.log(this.records)
      this.orderActive = true;
      this.liveOrderActive = false;
    });
  },
  methods:{
    onChangePhotoInput(e) {
      this.file = e.target.files[0];
    },
    // async uploadPhoto(){
    /*  const storageRef = await firebase.storage().ref();
      const imgRef = storageRef.child(`/users/${this.user.id}/profile/`)
      imgRef.put(this.file).on("state_changed", () => {
      },error => {
        console.log(error);
        this.loadingActive = false;
      },async ()=> {
        const img_src = await imgRef.getDownloadURL();
        this.shopReg.profileUrl = img_src;

      }
    },*/

    signOut(){
      firebase.auth().signOut().then(()=>{
        sessionStorage.clear();
        window.localStorage.removeItem('vuex');
        this.$store.state.user = '';
        console.log("logout");
        this.$router.push({name:'Home'});
        window.location.reload();
      }).catch(error=>{
        alert(error.message)
      });
      // firebase.auth().signOut();
      // // this.$router.push({name:"Home"});
      // window.location.reload();
    },
    async updateInfo(){
     // console.log(this.user);
      await db.collection('users').doc(this.user.id).update(this.user).then(()=>{
        alert("update ok");
      })
    },
    async chooseOrder(){
      await db.collection('users').doc(this.user.id).collection('orders').orderBy("time","desc").onSnapshot(snapshot => {
        this.records = [];
        snapshot.forEach(doc=>{
          this.records.push(doc.data());
        });
       // console.log(this.records)
        this.orderActive = true;
        this.liveOrderActive = false;
      });
    },
    async chooseLiveOrder(){
      await db.collection('users').doc(this.user.id).collection('liveOrders').orderBy("time","desc").onSnapshot(snapshot => {
        this.liveRecords = [];
        snapshot.forEach(doc=>{
          this.liveRecords.push(doc.data());
        })
       // console.log(this.liveRecords)
        this.orderActive = false;
        this.liveOrderActive = true;
      })
    }
  }
}
</script>

<style scoped>
.card{
  background-color: var(--light) !important;
}
.profile-box{
  height: 80%;
}
.btn-group .btn{
  width: 50%;
  border-radius: 0px !important;
}
.check-btn{
  width: 50%;
  border:2px solid var(--primary) !important;
  box-shadow: none !important;
  border-radius: 0px !important;
}

scroll-order{
  overflow-y: scroll;
  overflow-x: hidden;
}
.order-box{
  padding-top: 20px;
  padding-bottom: 20px;
  height: 80vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.check-btn{
  color: var(--text-color);
  background-color: var(--primary) !important;
}
.btn-outline-primary{
  background-color: var(--light) !important;
  color: var(--text-color) !important;
  border:2px solid var(--secondary) !important;
}
.check-btn{
  border:2px solid var(--secondary) !important;

  background-color: var(--secondary) !important;
  color: white !important;
}

@media screen and (max-width: 1100px) {
  .order-col{
    position: sticky;
  }
  .order-box{
    height: inherit;
    width: 100%;
  }
  .profile-box{
    height: inherit;
  }
}
</style>