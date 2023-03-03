<template>
  <div class="modal">
      <div class="card rounded shadow-lg">
        <div class="d-flex flex-column card-body text-center justify-content-center align-items-center">
            <div class="modal-body m-0">
              <p class="alert alert-warning" v-if="warningActive">{{warningMessage}}</p>
              <div class="d-flex">
                <img :src="selectedProduct.images[0]" v-if="selectedProduct.images.length>0" width="100" height="100" style="border-radius: var(--border-radius);" alt="">
                <img src="../assets/flash/1.png" v-else width="100" height="100" style="border-radius: var(--border-radius);" alt="">

                <div class="d-flex flex-column text-start ms-1">
                  <span> {{selectedProduct.itemName}}, {{selectedProduct.size}}</span>
                  <span v-if="selectedProduct.style!==''">{{ $t('message.stock') }} :{{selectedProduct.stock}} </span>
                  <span>{{ $t('message.barcode') }}: {{selectedProduct.barcode}}</span>

                </div>
              </div>
              <div class="d-flex flex-column my-2">
                <span class="badge mb-1" style="background-color: var(--side-bar-bg);color: var(--text-color);">1 Pcs = {{parseInt(selectedProduct.sellPrice).toLocaleString()}} Ks</span>
                <span class="badge mb-1" style="background-color: var(--side-bar-bg);color: var(--text-color);" v-if="selectedRelation.length>0">1 {{selectedRelation[0].frontUnit}} ({{selectedRelation[0].backNumber}} Pcs) = {{parseInt(selectedRelation[0].sellPrice).toLocaleString()}} Ks</span>
              </div>
              <div class="d-flex mb-2">

                <input type="number" min="1" class="form-control me-2" v-model="frontNumber">
                <select class="form-select fs-6 form-control form-select-lg rounded" @change="getSelectedRelation" style="height: 50px;background-color:var(--side-bar-bg)!important;border-radius: var(--border-radius) !important;"  v-model="frontUnit" aria-label=".form-select-sm example">
                  <option value="Pcs">Pcs</option>
                  <option :value="relation.frontUnit" v-for="(relation, index) in selectedRelations" :key="index">{{ relation.frontUnit }}</option>
                </select>
              </div>
              <div class="d-flex mt-3 w-100 border-0 align-items-center justify-content-between">
                <button type="button" class="btn me-1 " @click="closeModal" style="background-color: var(--light); color:var(--text-color);">
                  {{ $t('message.cancel') }}</button>
                <button type="button" class="btn text-white" autofocus ref="confirmBtn" @click="addToCart" style="background-color: var(--primary);">
                  {{ $t('message.confirm') }}</button>
              </div>
            </div>


            </div>
        </div>
  </div>
</template>

<script>

import db from "@/config/FirebaseInit";

export default {

  data(){
    return{
      frontNumber: 1,
      frontUnit: 'Pcs',
      selectedRelation:'',
      selectedRelations:[],
      warningMessage:'',
      warningActive:false,
       selectedSellProduct:[],

    }
  },
  name:"ProductSelectModal",
  props:['selectedProduct','owner'],
  computed:{/*
    selectedSellProduct(){
      return this.$store.getters.getSelectedSellProduct
    },*/
    selectedSellProductLists(){
      return this.$store.getters.getSelectedSellProductLists
    }
  },
  async mounted(){

    if(this.selectedSellProductLists){
      let index = this.selectedSellProductLists.findIndex(p=>p.index === localStorage.getItem('selectedSelection'));
      this.selectedSellProduct = this.selectedSellProductLists[index].selection;
      console.log('selection from dialog',index,this.selectedSellProduct)
    }

    this.$refs.confirmBtn.focus();
    console.log('child', this.selectedSellProduct);
    // console.log('child mounted', this.owner)
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('products').doc(this.selectedProduct.id).collection('relation').onSnapshot(snapshot => {
      if(snapshot.size===0){
        this.addToCart();
      }else {
        snapshot.forEach(doc=>{
          this.selectedRelations.push(doc.data());
        });
      }
    });
  },
  methods:{
    closeModal(){
      this.$emit("close-modal")
    },
    getSelectedRelation(){
      this.$refs.confirmBtn.focus();

      if(this.frontUnit!=='Pcs'){
        this.selectedRelation = this.selectedRelations.filter(relation => {
          return relation.frontUnit === this.frontUnit;
        });
      }else {
        this.selectedRelation =[];
      }
    },
    addToCart(){
      let product = this.selectedProduct;
      let pieceNumber = 1;
      let relationSellPrice = '';
      //If there is relation in the selected product, get the backnumber and sell price
      if(this.selectedRelation.length>0){
        pieceNumber = parseInt(this.selectedRelation[0].backNumber);
        relationSellPrice = parseInt(this.selectedRelation[0].sellPrice);
      }else {
        relationSellPrice = product.sellPrice;
      }
      const sameId = this.selectedSellProduct.findIndex(item => {
        return item.id === product.id;
      })

      if(this.selectedSellProduct.some(e=>e.id === product.id && e.frontUnit === this.frontUnit)){
        this.selectedSellProduct.forEach(item=>{
          if(item.frontUnit === this.frontUnit && item.id === product.id){
            let newStock = (this.frontNumber*pieceNumber);
            console.log('new stock', newStock)
            if(item.stock!==''){
              if(item.stock>=newStock){
                console.log('stock exist and count is less then stock');
                this.selectedSellProduct.forEach(p=>{
                  if(p.id === product.id){
                    p.stock =parseInt(p.stock) - newStock;
                  }
                })
                item.frontNumber = parseInt(item.frontNumber) + parseInt(this.frontNumber);
                item.count += (item.backNumber*this.frontNumber);
                this.searchProduct=null;
                this.frontNumber =1;
                this.frontUnit = 'Pcs';
                this.selectedRelations=[];
                this.selectedRelation='';
                this.closeModal();
                console.log('same id and same unit', item);
              }else {
                this.searchProduct=null;
                this.frontNumber =1;
                this.warningActive = true;
                this.warningMessage = this.$t('message.out_of_stock');
                setTimeout(()=>{
                  this.warningActive = false;
                },3000);
                return;
              }
            }else {
              item.frontNumber = parseInt(item.frontNumber) + parseInt(this.frontNumber);
              item.count += (item.backNumber*this.frontNumber);
              this.searchProduct=null;
              this.frontNumber =1;
              this.frontUnit = 'Pcs';
              this.selectedRelations=[];
              this.selectedRelation='';
              this.closeModal();

              // console.log('same id and same unit', item);
            }
          }
        })
      }else {
        if(product.stock!==''){
          if(product.stock>=((this.frontNumber*pieceNumber))){
            let newStock = 0;
            // this.selectedSellProduct.stock = product.stock -((this.frontNumber*pieceNumber));
            if(this.selectedSellProduct.some(p=>p.id === product.id)){
              newStock = parseInt(this.selectedSellProduct[sameId].stock)-((this.frontNumber*pieceNumber));
              this.selectedSellProduct.forEach(p=>{
                if(p.id === product.id){
                  p.stock = newStock;
                  console.log('update count', p.id)
                  // this.$store.commit("updateSelectedSellProduct", newStock,product.id)
                }
              })
              console.log('new same id item stock: ',this.selectedSellProduct[sameId].id);
              console.log(this.selectedSellProduct[sameId]);
            }else {
              newStock =parseInt(product.stock)-((this.frontNumber*pieceNumber))
            }
            let myProduct = {
              'frontNumber':this.frontNumber,
              'count':pieceNumber*this.frontNumber,
              'frontUnit':this.frontUnit,
              'backNumber':pieceNumber,
              'sellPrice':relationSellPrice,
              'itemCode':product.itemCode,
              'barcode':product.barcode,
              'id':product.id,
              'type':product.type,
              'images':product.images,
              'itemName':product.itemName,
              'stock':newStock,
              'buyPrice':product.buyPrice,
              'description':product.description,
              'color':product.color,
              'size':product.size,
              'weight':product.weight,
              'rating':product.rating,
              'discount':product.discount
            }
            console.log('child selected product', myProduct);
            this.$store.commit('SET_SELECTED_SELL_PRODUCT', myProduct);
           this.$store.commit('SET_SELECTED_SELL_PRODUCT_LISTS', {"index":localStorage.getItem('selectedSelection'),'selection': myProduct});

            this.searchProduct=null;
            this.frontNumber =1;
            this.frontUnit = 'Pcs';
            this.selectedRelations=[];
            this.selectedRelation='';
            console.log('different id and different unit');
            this.closeModal();

          }else {
            this.searchProduct=null;
            this.frontNumber =1;
            console.log('out of stock');
            this.warningActive = true;
            this.warningMessage = this.$t('message.out_of_stock');
            setTimeout(()=>{
              this.warningActive = false;
            },3000);
            return;
          }
        }else {
          let myProduct =  {
            'frontNumber':this.frontNumber,
            'count':pieceNumber*this.frontNumber,
            'frontUnit':this.frontUnit,
            'backNumber':pieceNumber,
            'sellPrice':relationSellPrice,
            'itemCode':product.itemCode,
            'barcode':product.barcode,
            'id':product.id,
            'type':product.type,
            'images':product.images,
            'itemName':product.itemName,
            'stock':'',
            'buyPrice':product.buyPrice,
            'description':product.description,
            'color':product.color,
            'size':product.size,
            'weight':product.weight,
            'rating':product.rating,
            'discount':product.discount
          }
         this.$store.commit('SET_SELECTED_SELL_PRODUCT_LISTS', {"index":localStorage.getItem('selectedSelection'),'selection': myProduct});
          this.$store.commit('SET_SELECTED_SELL_PRODUCT', myProduct);
          this.searchProduct=null;
          this.frontNumber =1;
          this.frontUnit = 'Pcs';
          this.selectedRelations=[];
          this.selectedRelation='';
          console.log('different id and different unit',this.selectedSellProduct);
          this.closeModal();


        }


      }


    },
  },
}
</script>

<style scoped>
.modal{
  top:0;
  z-index: 999999;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.6);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card{
  width: 400px;
  background-color: var(--light);
  border-radius: 20px !important;
}
button{
  width: 150px;
  border-radius: var(--border-radius);
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
/*
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
*/

/*.toast-enter-from{
  opacity: 0;
  transform:translateY(-60px) ;
}
.toast-enter-to{
  opacity: 1;
  transform: translateY(0);

}
.toast-enter-active{
  transition: all 0.5s ease;
}
.toast-leave-from{
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-to{
  opacity: 0;
  transform:translateY(-60px) ;
}
.toast-leave-active{
  transition: all 0.5s ease;
}
@keyframes wobble {
  0% {transform:translateY(-60px);opacity: 0}
  50% {transform:translateY(-60px);opacity: 1}
}*/
</style>