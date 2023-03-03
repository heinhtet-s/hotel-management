<template >
  <AdminSidebar>
    <Loading v-if="loadingActive"/>
    <div class="modal fade" id="exampleModal" style="z-index: 10000" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content bg-light " style="border-radius: var(--border-radius); border: none">
          <div class="modal-header align-items-center">
            <!--                  <h5 class="modal-title text-black" id="exampleModalLabel"> <i class="fas fa-shopping-cart"></i> Invoice </h5>-->
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form action="">
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="shopInfo.name" id="name-input" placeholder="enter name">
                <label for="name-input">name</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="shopInfo.phone" id="name-input" placeholder="enter phone">
                <label for="name-input">phone</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="shopInfo.address" id="name-input" placeholder="enter address">
                <label for="name-input">address</label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary mx-auto my-2 w-50" @click="save" data-bs-dismiss="modal">Save</button>

          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="d-flex align-items-center">
        <button @click="$router.back()" class=" btn fs-5"><i class="fas fa-chevron-left"> </i>
        </button>
        <span class="text-center fs-3 my-2">Profile</span>
      </div>

      <div class="d-flex justify-content-center d-flex justify-content-center align-items-center mx-auto rounded-circle" style="width: 210px; height: 210px; border:2px solid var(--secondary);">
        <img :src="shopInfo.profileUrl" class="rounded-circle" width="200" height="200" alt="">
      </div>
      <div class="d-flex flex-column align-items-center justify-content-center my-2">
        <h3>{{shopInfo.name}}</h3>
        <span>{{cashierAcc.email}}</span>
        <button class="btn rounded w-25 my-3" data-bs-toggle="modal" v-if="cashierAcc.accountLevel==='admin'" data-bs-target="#exampleModal" style="background-color: var(--btnLight);">Edit</button>
        <table>
          <tr>
            <td>Shop Code</td>
            <td class="text-end">{{shopInfo.shopCode}}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td class="text-end">{{shopInfo.phone}}</td>
          </tr>
          <tr>
            <td>
              Address
            </td>
            <td class="text-end">{{shopInfo.address}}</td>
          </tr>
        </table>

        <button class="w-25 btn mt-3 position-fixed text-white" style="bottom: 10px;background-color: var(--primary);" @click="adminLogout"><i class="fas fa-right-from-bracket"></i> logout</button>
      </div>
    </div>
  </AdminSidebar>

</template>

<script>
import AdminSidebar from "@/components/AdminSidebar";
import firebase from "firebase/compat";
import db from '../../config/FirebaseInit'
import Loading from "@/components/Loading";
export default {
  components:{AdminSidebar, Loading},
  data(){
    return{
      loadingActive:false

    }
  },
  computed:{
    cashierAcc(){
      return this.$store.getters.getCashierAcc
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    }
  },
  methods:{
    save(){
      db.collection(this.owner.city).doc(this.owner.shopId).update({
        'address':this.shopInfo.address,
        'phone':this.shopInfo.phone,
        'name':this.shopInfo.name
      }).then(()=>{
        db.collection('shopRegistration').doc(this.owner.id).update({
          'address':this.shopInfo.address,
          'phone':this.shopInfo.phone,
          'name':this.shopInfo.name
        }).then(()=>{
          this.$store.dispatch('getShopInfo',this.owner);
          this.$store.dispatch('getCurrentShop');
          console.log('update ok')
        })

      })
      //console.log(this.shopInfo)
    },
    async adminLogout(){
      this.loadingActive = true;
      await db.collection(this.shopInfo.city).doc(this.shopInfo.id).collection('account').doc(this.cashierAcc.id).update({
        'loginStatus':'no',
        'deviceId':""
      }).then(()=>{
        firebase.auth().signOut().then(()=>{
          window.localStorage.removeItem('vuex');
          sessionStorage.clear();
          this.$store.state.shopOwner='';
          console.log("logout");
          this.$router.push({name:'ShopOwnerLogin'});
          this.loadingActive = false;
        }).catch(error=>{
          alert(error.message);
        });
      })

    },
  }
}
</script>

<style scoped>
td{

  width: 300px;
  padding: 10px;
}
tr{
  background-color: var(--light);
  padding: 10px;
  border-radius: var(--border-radius);
  border-bottom: 2px solid white;
}
</style>