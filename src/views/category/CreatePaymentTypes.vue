<template>
<!--  Admin-->
  <AdminNavigation />
  <div class="container pt-5">
    <div class="row mt-3">
      <div class="d-flex align-items-center">
        <button class="btn" @click="$router.back();"><i class="fas fa-chevron-left"></i></button>
        <span class="fs-4">Create Category Payment Methods</span>
      </div>
      <div class="col-12 col-lg-4 mx-auto">
        <div class="card bg-white rounded">
          <div class="card-body">
            <div class="form">
              <div class="text-start">
                <label for="img-input" class="mb-2">Upload Images (Optional)</label>
                <input required type="file" @change="onChangePhotoInput" accept="image/*" id="img-input" multiple class="form-control mb-3" ref="photo" placeholder="photo">
              </div>
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="category.name" id="barcode-input" placeholder="enter shop name">
                <label for="barcode-input">Payment name</label>
              </div>
              <button class="btn btn-dark w-50" @click.prevent="upload">Save</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-8 ">
        <table class="table table-hover table-bordered">
          <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Control</th>
            <th>Created At</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(category, index) in categories" :key="index">
            <td>{{index+1}}</td>
            <td>{{category.name}}</td>
            <td>
              <button class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></button>
            </td>
            <td><i class="fas fa-calendar m-1"></i> <span>{{category.createdAt.toDate().toLocaleDateString()}}</span> <i class="fas fa-clock mx-1"></i> <span>{{category.createdAt.toDate().toLocaleTimeString()}}</span></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavigation from "@/components/AdminNavigation";
import db,{timestamp} from "@/config/FirebaseInit";
export default {
  components:{AdminNavigation},
  data(){
    return{
      infoModalActive:false,
      modalMessage:'',
      loadingActive:false,
      confirmActive:false,

      categories:[],
      category:{
        name:"",
        id:"",
        url:"default",
      }
    }
  },
  async mounted() {
    await db.collection('paymentCategories').onSnapshot(snapshot => {
      this.categories=[];
      snapshot.forEach(doc=>{
        this.categories.push(doc.data());
      })
    })
  },
  methods:{
    confirm(){
      this.loadingActive = true;
      this.confirmActive = !this.confirmActive;

      db.collection(this.owner.city).doc(this.owner.shopId).collection('promotionCode').doc(this.deleteId).delete().then(()=>{
        this.loadingActive = false;
        this.modalMessage='Deleted';
        this.infoModalActive=true;
      })
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    deletePromCode(id){
      this.confirmActive = true;
      this.modalMessage = 'Are you sure to Delete?'
      this.deleteId = id;
    },
    onChangePhotoInput(){

    },
    async upload(){
      const categoryRef =  await db.collection('paymentCategories').doc()
      this.category.createdAt = timestamp;
      this.category.id = categoryRef.id;
      await categoryRef.set(this.category).then(()=>{
        alert("Upload Ok")
      }).catch(error=>{
        alert(error.message)
      })
    }
  }
}
</script>

<style scoped>

</style>