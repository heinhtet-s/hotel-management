<template>

  <AdminNavigation>
    <div class="container pt-5">
      <div class="row pt-5">
        <div class="col-12 col-lg-6 mx-auto">
          <div class="d-flex justify-content-between">
            <h3 class="my-2">Shop Owners</h3>
            <router-link :to="{name:'ShopRegistration'}">
              <button class="btn btn-outline-dark m-2 rounded-3"><i class="fas fa-circle-plus"></i></button>

            </router-link>
          </div>
          <table class="table table-hover border">
            <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Control</th>
            </tr>

            </thead>
            <tbody>
            <tr v-for="(shop, index) in shopOwners" :key="index">
              <td>{{index+1}}</td>
              <td>{{shop.name}}</td>
              <td>{{shop.email}}</td>
              <td>
                <button class="btn btn-outline-dark btn-sm">
                  <i class="fas fa-info-circle"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="col-12 col-lg-6">
          <h3 class="my-2">Users</h3>

          <table class="table table-hover border">
            <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Control</th>
            </tr>

            </thead>
            <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td>{{index+1}}</td>
              <td>{{user.name}}</td>
              <td>{{user.email}}</td>
              <td>
                <button class="btn btn-outline-dark btn-sm">
                  <i class="fas fa-info-circle"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </AdminNavigation>
</template>

<script>
import "firebase/compat/auth";
import db from "@/config/FirebaseInit";
import AdminNavigation from "@/components/AdminNavigation";
export default {
  components:{AdminNavigation},
  data(){
    return{
      shopOwners:[],
      users:[],
    }
  },
  async mounted(){
    await db.collection('shopRegistration').onSnapshot(snapshot => {
      snapshot.forEach(doc=>{
        this.shopOwners.push(doc.data())
      })
    });
    await db.collection('users').onSnapshot(snapshot => {
      snapshot.forEach(doc=>{
        this.users.push(doc.data())
      })
    });
  }
}
</script>

<style scoped>

</style>