<template>
  <AdminNavigation>
    <div class="container">
      <div class="row mt-5 pt-5">
        <h3 class="my-2">Users</h3>

        <div class="col-12 table-responsive">

          <table class="table table-hover border">
            <thead>
            <tr>
              <th class="text-nowrap">#</th>
              <th class="text-nowrap">Name</th>
              <th class="text-nowrap">Email</th>
              <th class="text-nowrap">Control</th>
            </tr>

            </thead>
            <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td class="text-nowrap">{{index+1}}</td>
              <td class="text-nowrap">{{user.name}}</td>
              <td class="text-nowrap">{{user.email}}</td>
              <td class="text-nowrap">
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
      users:[],
    }
  },
  async mounted(){
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