<template>
  <AdminNavigation  />
  <div class="container">
    <div class="row mt-5 pt-5">
      <div class="">
        <h3>Create Shop Type</h3>
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
                <label for="barcode-input">Category name</label>
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
            <th>Created At</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(category, index) in categories" :key="index">
            <td>{{index+1}}</td>
            <td>{{category.name}}</td>
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
      categories:[],
      category:{
        name:"",
        id:"",
        url:"default",
        createdAt:"",
      }
    }
  },
  async mounted() {
    await db.collection('shopTypes').onSnapshot(snapshot => {
      this.categories = [];
      snapshot.forEach(doc=>{
        this.categories.push(doc.data());
        /*if(!this.categories.some((cate)=>cate.id === doc.id))*/
      })
    })
  },
  methods:{
    onChangePhotoInput(){

    },
    async upload(){
      const categoryRef =  await db.collection('shopTypes').doc()
      this.category.createdAt = timestamp;
      this.category.id = categoryRef.id;
      categoryRef.set(this.category).then(()=>{
        this.category.name='';
        //alert("Upload Ok")
      }).catch(error=>{
        alert(error.message)
      })
    }
  }
}
</script>

<style scoped>

</style>