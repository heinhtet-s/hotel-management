<template>
  <!--  Shop-->
  <admin-sidebar>
    <Loading v-if="loadingActive"/>
    <ImageView v-if="imageViewActive" :image="imageUrl" v-on:close-modal="closeImageModal"/>

    <div class="row">
      <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeInfoModal"/>
      <confirm-dialog :modal-message="modalMessage" v-if="confirmActive" v-on:confirm="confirm" v-on:cancel="cancel"/>
      <div class="modal fade mt-4" id="exampleModal" aria-hidden="true" aria-labelledby="exampleModalLabel" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0" style="background-color: var(--background-color);border-radius: var(--border-radius);">
            <div class="modal-header border-0">
              <h5 class="modal-title">New Category</h5>
              <button type="button" style="color: var(--text-color)!important;" id="btn-close" class="btn" data-bs-dismiss="modal" ><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <form @submit.prevent="addNewCategory">
                  <div class="d-flex mb-2">
                    <input type="text" required class="form-control" placeholder="enter name" v-model="newCategory.name">
                    <button type="submit" class="btn float-end ms-1" style="background-color: var(--btnLight);" data-bs-dismiss="modal">Add</button>
                  </div>
                </form>
                <div style="height: 500px; overflow-y: scroll">
                  <card class="card" style="background-color: var(--light)!important;" v-for="cate in expenseCategories" :key="cate.id">
                    <div class="d-flex p-2 justify-content-between align-items-center">
                      <span>{{cate.name}}</span>
                      <div>
                        <button class="btn btn-sm btn-danger" @click="deleteCategory(cate)"><i class="fas fa-times"></i></button>
                      </div>
                    </div>
                  </card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade mt-4" id="exampleModal2" aria-hidden="true" aria-labelledby="exampleModal2Label" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0" style="background-color: var(--background-color); border-radius: var(--border-radius);">

            <div class="modal-header border-0">
              <h5 class="modal-title">Update</h5>
              <button type="button" style="color: var(--text-color)!important;" id="btn-close" class="btn" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button>
            </div>

            <div v-if="selectedExpense.image">
              <div class="p-1 mb-2" style="background-color: var(--light);border-radius: var(--border-radius); width: 100%;">
                <div class="btn btn-sm bg-danger text-white float-end" @click="clearFile">Clear</div>
                <div class="d-flex pb-3" style="background-color: var(--light);overflow-x: scroll; width: 100%;">
                  <div v-if="updatePreviewImages.length>0">
                    <img :src="updatePreviewImages[0]" width="100" height="100"  @click="viewImage" alt="">

                  </div>
                  <div v-else>
                    <img :src="selectedExpense.image" width="100" height="100"  @click="viewImage" alt="">

                  </div>
                </div>
                <div class="btn btn-sm " @click="selectUpdateImage" style="background-color: var(--background-color);">
                  <i class="fas fa-file-arrow-up"></i> Upload Photo
                </div>
                <div class="text-start">
                  <input type="file" @change="pickUpdateFile" hidden accept="image/*" id="img-input" class="form-control mb-3" ref="photo2" placeholder="photo">
                  <!--<input type="file" @change="onChangePhotoInput"   accept="image/*" id="img-input" multiple class="form-control mb-3" ref="photo" placeholder="photo">-->
                </div>
              </div>

            </div>
            <div class="modal-body">
              <div class="row">
                <form @submit.prevent="updateExpense">
                  <div class="form-floating mb-3">
                    <input type="text" required class="form-control" v-model="selectedExpense.amount" id="selectedExpense-amount" placeholder="enter amount">
                    <label for="selectedExpense-amount">Amount</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="date" class="form-control" v-model="selectedExpense.date" @change="updateFormatDate($event)" id="selectedExpense-date" placeholder="enter phone">
                    <label for="selectedExpense-date">{{selectedExpense.date}}</label>
                  </div>
                  <div class="form-floating mb-3 ">
                    <input type="text" class="form-control" v-model="selectedExpense.remark" id="selectedExpense-remark" placeholder="enter address">
                    <label for="selectedExpense-remark">Remark</label>
                  </div>
                  <div class="w-100">
                    <div class="d-flex align-items-center">
                      <select class="form-select fs-6 form-control rounded" required v-model="updateExpenseCategory" aria-label=".form-select-sm example">
                        <option selected disabled>Choose Category</option>
                        <option :value="{name:category.name,id:category.id}" :selected="selectedExpense.categoryName === category.name" v-for="category in expenseCategories" :key="category.id">{{ category.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center my-2">
                    <button class="btn btn-outline-danger w-25 float-end" @click="deleteExpense" data-bs-dismiss="modal">Delete</button>
                    <button type="submit" class="btn w-25" style="background-color: var(--btnLight);" dat-bs-dismiss="modal">Update</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <button @click="$router.back()" style="color: var(--text-color);" class=" btn fs-5"><i class="fas fa-chevron-left"> </i>
        </button>
        <span class="fs-3">Expenses</span>
      </div>
      <!--          Add box-->
      <div class="col-12 col-lg-4">
        <div class="card" style="background-color: var(--background-color) !important;" >
          <div class="card-body p-2" style="background-color: var(--light)!important;">
            <h4><i class="fas fa-plus-circle"></i> Add Expense</h4>
            <div class="p-1 mb-2" style="background-color: var(--light);border-radius: var(--border-radius); width: 100%;">
              <div class="btn btn-sm bg-danger text-white float-end" @click="clearFile">Clear</div>
              <div class="d-flex pb-3" style="background-color: var(--light);overflow-x: scroll; width: 100%;">
                <div class="rounded p-1 m-1" style="background-color: var(--light);" v-for="(previewImage,index) in previewImages" :key="index">
                  <img :src="previewImage" width="100" height="100"  @click="selectImage" alt="">
                </div>
              </div>
              <div class="btn btn-sm " @click="selectImage" style="background-color: var(--background-color);">
                <i class="fas fa-file-arrow-up"></i> Upload Photo
              </div>
              <div class="text-start" >
                <input type="file" @change="pickFile" hidden accept="image/*" id="img-input" class="form-control mb-3" ref="photo" placeholder="photo">
                <!--            <input type="file" @change="onChangePhotoInput"   accept="image/*" id="img-input" multiple class="form-control mb-3" ref="photo" placeholder="photo">-->
              </div>
            </div>

            <form @submit.prevent="addExpenses">
              <div class="form-floating mb-3">
                <input type="text" required class="form-control" v-model="expense.amount" id="expense-amount" placeholder="enter amount">
                <label for="expense-amount">Amount</label>
              </div>
              <div class="form-floating mb-3">
                <input type="date" required class="form-control" @change="formatDate($event)" id="expense-date" placeholder="enter phone">
                <label for="expense-date">Date</label>
              </div>
              <div class="form-floating mb-3">
                <input type="text" class="form-control" v-model="expense.remark" id="expense-remark" placeholder="enter address">
                <label for="expense-remark">Remark (Optional)</label>
              </div>
              <div class="w-100">
                <div class="d-flex align-items-center">
                  <select class="form-select fs-6 form-control rounded" required v-model="selectedCategory" aria-label=".form-select-sm example">
                    <option selected disabled>Choose Category</option>
                    <option :value="{name:category.name,id:category.id}" v-for="category in expenseCategories" :key="category.id">{{ category.name }}</option>
                  </select>
                  <div class="btn ms-3" style="background-color: var(--btnLight);" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-circle-plus"></i></div>
                </div>
              </div>
              <button type="submit" class="btn mt-3 w-100 float-end" style="background-color: var(--btnLight);">Add</button>
            </form>
          </div>
        </div>
      </div>
      <!--          Expense List-->
      <div class="col-12 col-lg-8">
        <!--            Category Box-->
        <div class="d-flex justify-content-between">
          <div class="d-flex flex-column">
            <span>Total Expenses</span>
            <span class="text-success">{{totalPrice.toLocaleString()}} Ks</span>
          </div>
          <span>
                {{selectedDate}}
              </span>
          <div>
            <input type="month" @change="formatMonth" class="form-control">
          </div>
        </div>
        <div class="category-box d-lg-flex">
          <ul class="text-start d-block list-unstyled border-0 align-center">
            <li class="d-inline-block mx-1 category-list" :class="selectedCategoryName==='All'?'category-list-active':''" style="background-color: var(--light);" @click="selectCategory('All')">
              <span class="mx-2"> All</span>
            </li>
            <li v-for="(category, index) in expenseCategories" style="background-color: var(--light);" :key="index" class="category-list d-inline-block" :class="selectedCategoryName===category.name?'category-list-active':''" @click="selectCategory(category.name)">
              <span class="mx-2">{{category.name}}</span>
            </li>
          </ul>
        </div>

        <div style="background-color:var(--side-bar-bg);border-radius:var(--border-radius);height: 60vh; overflow-y: scroll">
          <div type="button" class="card p-2" v-for="expense in filterExpenses" :key="expense.id" @click="chooseExpense(expense)" data-bs-toggle="modal" data-bs-target="#exampleModal2">
            <div class="d-flex justify-content-between">
              <div class="d-flex flex-column">
                <span class="badge rounded-pill text-start" style="background-color: var(--side-bar-bg);color: var(--text-color-light);">{{expense.categoryName}}</span>
                <span>{{expense.remark}}</span>
              </div>
              <div class="d-flex flex-column text-end">
                <span class="text-black-50">{{expense.date}}</span>
                <span class="text-danger">{{expense.amount}} Ks </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </admin-sidebar>

</template>

<script>
import db, {storage, timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AdminSidebar from "@/components/AdminSidebar";
import ImageView from "@/components/ImageView";
export default {
  components: {ImageView, ConfirmDialog, InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      date: new Date().toISOString().slice(0,10),
      modalMessage:'',
      dismissModal:'true',
      loadingActive:false,
      infoModalActive:false,
      confirmActive:false,
      expenseCategories:[],
      selectedCategory:'Choose Category',
      updateExpenseCategory:'',
      selectedExpense:'',
      selectedCategoryName:'All',
      totalPrice:0,
      selectedDate:'',
      imageViewActive:false,
      imageUrl:'',
      newCategory:{
        name:'',
        id:'',
        createdAt: ''
      },
      allSrc:[],
      allSrc2:[],
      previewImages:[],
      updatePreviewImages:[],
      expenses:'',
      expense:{
        amount:'',
        categoryId:'',
        categoryName:'',
        createdAt:'',
        date:'',
        id:'',
        month:'',
        remark:'',
        image:'',
      }
    }
  },
  computed:{
    owner(){
      return this.$store.getters.getShopOwner;
    },
    today(){
      return this.getToday();
    },
    currentDateTime(){
      return this.$store.getters.getDateTime;
    },
    currentDay(){
      return this.$store.getters.getDay;
    },
    currentMonth(){
      return this.$store.getters.getMonth;
    },
    currentYear(){
      return this.$store.getters.getYear;
    },
    filterExpenses(){
      if(this.selectedCategoryName!=='All'){
        return this.expenses.filter(e=>e.categoryName === this.selectedCategoryName);
      }else {
        return this.expenses;
      }

    }
  },
  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.selectedDate = this.currentMonth;
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenseCategory').orderBy('name').onSnapshot(snapshot => {
      this.expenseCategories=[];
      snapshot.forEach(doc=>{
        if(doc.data().name!=='All'){
          this.expenseCategories.push(doc.data());
        }
      });
    });
    await this.getExpense();
  },
  methods: {
    closeImageModal(){
      this.imageViewActive = !this.imageViewActive;
    },

    selectImage() {
      this.$refs.photo.click();
    },
    selectUpdateImage() {
      this.$refs.photo2.click();
    },

    viewImage(){
      this.imageViewActive = true;
      this.imageUrl=this.selectedExpense.image;
    },

    clearFile() {
      this.previewImages = [];
      this.allSrc = [];
      console.log('clear all src', this.allSrc)

    },

    pickUpdateFile(e){
      const files = e.target.files;
      if (files) {
        this.allSrc2.push(files[0]);
        let reader = new FileReader
        reader.onload = e => {
          this.updatePreviewImages.push(e.target.result);
        }
        reader.readAsDataURL(files[0])
        this.$emit('input', files[0])
      }
      console.log('allsrc', this.allSrc)
    },

    pickFile(e) {
      // let input = this.$refs.fileInput
      const files = e.target.files;
      if (files) {
        this.allSrc.push(files[0]);
        let reader = new FileReader
        reader.onload = e => {
          this.previewImages.push(e.target.result);
        }
        reader.readAsDataURL(files[0])
        this.$emit('input', files[0])
        // for (let i = 0; i < files.length; i++) {
        //
        // }

      }
      console.log('allsrc', this.allSrc)
    },
    selectCategory(category) {
      this.selectedCategoryName = category;
      this.totalPrice = 0;
      this.filterExpenses.forEach(e => {
        this.totalPrice += parseInt(e.amount)
      })
    },
    chooseExpense(expense) {
      this.selectedExpense = expense;
      this.updateExpenseCategory = {name: expense.categoryName, id: expense.categoryId};
    },
    deleteExpense() {
      this.confirmActive = true;
      this.modalMessage = "Are you sure to delete!";
    },
    async updateExpense() {
      if (this.selectedExpense.amount !== '' && this.selectedExpense.date !== '' && this.selectedCategory.name !== '') {
        this.selectedExpense.categoryName = this.updateExpenseCategory.name;
        this.selectedExpense.categoryId = this.updateExpenseCategory.id;
        if (this.allSrc2.length > 0) {
          this.loadingActive = true;
          const storageRef = await storage.ref();
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/expenses/${this.expense.id}`)
          imgRef.put(this.allSrc2[0]).on("state_changed", () => {
          }, error => {
            console.log(error)
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.selectedExpense.image=img_src;
            await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenses').doc(this.selectedExpense.id).update(this.selectedExpense).then(() => {
              console.log('update ok');
              this.loadingActive = false;
              this.infoModalActive = true;
              this.modalMessage = 'Update Ok';
            })
          })
        } else {
          await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenses').doc(this.selectedExpense.id).update(this.selectedExpense)
          console.log('update ok');
          this.loadingActive = false;
          this.infoModalActive = true;
          this.modalMessage = 'Update Ok';
        }

      }
    },

    async getExpense() {
      console.log(this.selectedDate);
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenses').where('month', '==', this.selectedDate).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        this.expenses = [];
        this.filterExpenses = [];
        this.totalPrice = 0;
        snapshot.forEach(doc => {
          this.expenses.push(doc.data())
        });
        if (this.filterExpenses.length > 0) {
          this.filterExpenses.forEach(exp => {
            this.totalPrice += parseInt(exp.amount);
          })
        }
        console.log(this.expenses)
      });
    },
    async addNewCategory() {
      if (this.newCategory.name !== '') {
        if (!this.expenseCategories.some(e => e.name === this.newCategory.name)) {
          console.log('not exist')
          let expenseCategoryRef = await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenseCategory').doc();
          this.newCategory.createdAt = timestamp;
          this.newCategory.id = expenseCategoryRef.id;
          await expenseCategoryRef.set(this.newCategory).then(() => {
            console.log('category added');
            this.newCategory.name = '';
            this.newCategory.id = '';
          })
        } else {
          console.log('exists')
          this.infoModalActive = true;
          this.modalMessage = "Category's already existed!"
        }

      }

    },
    async deleteCategory(cate) {
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenses').where('categoryName', '==', cate.name).limit(1).get().then((snapshot) => {
        if (snapshot.size > 0) {
          this.infoModalActive = true;
          this.modalMessage = "You have the expenses with this category";
        } else {
          db.collection(this.owner.city).doc(this.owner.shopId).collection('expenseCategory').doc(cate.id).delete().then(() => {
            console.log('delete ok');
          });
        }
      })

    },
    async addExpenses() {
      if (this.expense.date !== '' && this.expenses.categoryName !== '' && this.expenses.amount !== '' && this.selectedCategory !== 'Choose Category') {
        let expenseRef = await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenses').doc();
        // this.expense.date = this.formatDate(this.expense.date);
        this.expense.createdAt = timestamp;
        this.expense.month = this.currentMonth;
        this.expense.id = expenseRef.id;
        this.expense.categoryName = this.selectedCategory.name;
        this.expense.categoryId = this.selectedCategory.id;
        if (this.allSrc.length > 0) {
          this.loadingActive = true;
          const storageRef = await storage.ref();
          const imgRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/expenses/${this.expense.id}`)
          imgRef.put(this.allSrc[0]).on("state_changed", () => {
          }, error => {
            console.log(error)
          }, async () => {
            const img_src = await imgRef.getDownloadURL();
            this.expense.image=img_src;
            await this.uploadDoc(expenseRef)
          })
         /* this.allSrc.forEach((img, index) => {

          })*/
        } else {
          this.loadingActive = false;
          this.expense.image = [];
          await this.uploadDoc(expenseRef)
        }
      }else {
        this.loadingActive = false;
        this.infoModalActive = true;
        this.modalMessage = 'Sorry! Please select category.'
      }
    },
    async uploadDoc(expenseRef) {
      console.log('expenses',this.expense)
      await expenseRef.set(this.expense);
      console.log('expense added');
      this.expense.amount = '';
      this.expense.date = '';
      this.expense.categoryName = '';
      this.expense.categoryId = '';
      this.expense.remark = '';
      this.expense.month = '';
      this.expense.date = '';
      this.previewImages=[];
      this.allSrc=[];
      this.expense.images=[];
      this.infoModalActive = true;
      this.modalMessage='Added Successfully!';
      this.loadingActive = false;
    },

    closeInfoModal(){
      this.infoModalActive = !this.infoModalActive;
    },
    cancel(){
      this.confirmActive = !this.confirmActive;
    },
    async confirm(){
      this.confirmActive = !this.confirmActive;
      this.loadingActive = true;
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('expenses').doc(this.selectedExpense.id).delete().then(()=>{
        if(this.selectedExpense.images!=undefined){
          if(this.selectedExpense.images.length>0){
            const storageRef = storage.ref();
            const fileRef = storageRef.child(`/${this.owner.city}/${this.owner.shopId}/expenses/${this.selectedExpense.id}`);
            fileRef.delete().then(()=>{
              console.log('img deleted')
            })
          }
        }
        this.loadingActive=false;
        this.infoModalActive = true;
        this.modalMessage = 'Delete success!'
      });
    },
    formatDate(payload){
      const date = new Date(payload.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      this.expense.date = day+"-"+month+"-"+year;
      this.expense.month =month+"-"+year;
    },
    updateFormatDate(payload){
      const date = new Date(payload.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
      this.selectedExpense.date = day+"-"+month+"-"+year;
      this.selectedExpense.month =month+"-"+year;
    },
    formatMonth(e){
      const date = new Date(e.target.value);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      this.selectedDate = month+"-"+year;
      this.getExpense();
    },
    closeModal(){
      this.infoModalActive = !this.infoModalActive;
    },
  }
}
</script>

<style scoped>
tr{
  color: var(--text-color);
}
.card{
  cursor: pointer;
  transition: 0.3s;
}
.card:hover{
  background-color: var(--light)!important;
}
.category-box{
  border-radius: var(--border-radius);
  padding: 5px;
  margin-bottom: 5px;
  z-index: 1000;
  background-color: var(--side-bar-bg);
  position: sticky;
  box-sizing: border-box;
  margin-top:5px;
  margin-left: 0px;
  height: inherit;
  align-items: center;
}
.category-list-active{
  background-color: var(--btnLight) !important;
}
.category-list:hover{
  background-color: var(--primary);
}
.category-box ul{
  height: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}
.category-list {
  cursor: pointer;
  border: none !important;
  border-bottom: 1px solid;
  height: inherit;
  min-width: 60px;
  text-align: center;
  display: inline;
  padding: 5px;
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 5px;
  border-radius: var(--border-radius);
  background-color: var(--btnLight);
  transition: 0.3s;
}
.mx-compound-control input {
  visibility: hidden;
  min-width: 0;
  max-width: 0;
  padding: 0;
  border: 0;
}

</style>