<template>

  <AdminSidebar>
    <Loading v-if="loadingActive"/>
    <InfoDialog v-if="infoModalActive" :modal-message="modalMessage" v-on:close-modal="closeModal"/>
    <div class="checkin-modal" v-if="showCheckinPanel">
      <div class="modal-card rounded shadow-lg">
        <div class="d-flex flex-column card-body text-center justify-content-center align-items-center">
          <div class="modal-body m-0">
            <div >
              <div class="d-flex justify-content-between">
                <h3>{{ checkIn.id === '' ? $t('message.create_reservation') : $t('message.update_reservation') }} </h3>
              <button class="btn fs-5" @click="showCheckinPanel = false"><i class="fas fa-times"></i></button>
              </div>
              
             <div>
               <span v-if="checkIn.id !== ''" class="fs-5" style="color: var(--primaryLight);">Cost: {{parseInt(selectedApartment.price * selectedCheckin.dateList.length).toLocaleString()}} Ks</span>
               <span v-else class="fs-5" style="color: var(--primaryLight);">Cost: {{parseInt(selectedApartment.price * chosenDateList.length).toLocaleString()}} Ks</span>

             </div>
              <div>
                <div class="d-flex p-1" v-if="checkIn.id===''">
                  <div class="d-flex p-3 rounded shadow " style=" overflow: auto; white-space: nowrap;width:600px;box-sizing: border-box;">
                    <div class="d-flex align-items-center shadow text-light p-1 me-1" style="background-color: var(--primary);border-radius:var(--border-radius);" v-for="(date,i) in chosenDateList" :key="i">
                      <span class="me-2">{{date}}</span>
                      <button class="btn d-flex align-items-center justify-content-center btn-sm rounded-circle" v-if="i===chosenDateList.length-1" @click="removeLastChosenDate(date)"  style="width: 20px; height: 20px; color: var(--gray);background-color: var(--light);"><i class="fas fa-times"></i></button>
                    </div>
                  </div>

                  <button class="btn ms-2 text-white" style="background-color: var(--primary);" @click="extendSelectedCheckinDateList">
                    <i class="fas fa-circle-plus"></i>
                  </button>
                </div>
                <div class="d-flex p-1"  v-else>
                  <div class="d-flex p-3 rounded shadow " style=" overflow: auto; white-space: nowrap;width:600px;box-sizing: border-box;">
                    <div class="d-inline-block d-flex align-items-center shadow text-light p-1 me-1" style="background-color: var(--primary);border-radius:var(--border-radius); font-size: 12px" v-for="(date,i) in selectedCheckin.dateList" :key="i">
                      <span class="me-2">{{date}}</span>
                      <button class="btn d-flex align-items-center justify-content-center btn-sm rounded-circle" v-if="i===selectedCheckin.dateList.length-1" @click="removeLastChosenDate(date)" style="width: 20px; height: 20px; color: var(--gray);background-color: var(--light);"><i class="fas fa-times"></i></button>
                    </div>
                  </div>
                  <button class="btn ms-2 text-white" style="background-color: var(--primary);border-radius: var(--border-radius);" @click="extendSelectedCheckinDateList">
                    <i class="fas fa-circle-plus"></i>
                  </button>
                </div>
              </div>
              <form class="row" @submit.prevent="checkedIn">
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input
                        type="text"
                        id="name"
                        v-model="checkIn.customerName"
                        class="form-control"
                        required
                        placeholder="Enter your name"
                    />
                    <label for="name">Name</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input
                        type="number"
                        id="phone"
                        v-model="checkIn.customerPhone"
                        class="form-control"
                        required
                        placeholder="Enter your phone"
                    />
                    <label for="phone">Phone</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input
                        type="number"
                        id="people"
                        v-model="checkIn.numberOfAdults"
                        class="form-control"
                        required
                        placeholder="Enter Ms Code"
                    />
                    <label for="people">Adult Count</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input
                        type="number"
                        id="people"
                        v-model="checkIn.numberOfKids"
                        class="form-control"
                        required
                        placeholder="Enter Ms Code"
                    />
                    <label for="people">Infant Count</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input
                        type="number"
                        id="table"
                        v-model="checkIn.paidAmount"
                        class="form-control"
                        required
                        placeholder="Enter Ms Code"
                    />
                    <label for="table">Paid Amount</label>
                  </div>
                </div>

                <div class="d-flex mt-3 w-100 border-0 align-items-center justify-content-between">
                  <button type="button" class="btn me-1 " @click="closeCheckinPanel" style="background-color: var(--light); color:var(--text-color);">
                    {{ $t('message.cancel') }}</button>
                  <button type="submit" class="btn text-white" ref="confirmBtn" style="background-color: var(--primary);">
                    {{checkIn.id!==''?$t('message.update') : $t('message.confirm') }}</button>
                </div>
              </form>

            </div>

          </div>

        </div>
      </div>
    </div>
    <div class="d-flex align-items-center rounded">
      <button  class="btn text-start p-0 fs-5" style="color: var(--primary);"  @click="$router.back()"><i class="fas fa-chevron-left"> </i>        <span class="fs-3">{{ $t('message.apartment_info') }}</span>
      </button>
    </div>
    <div>

      <h4>{{selectedApartment.name}} |  {{parseInt(selectedApartment?.price).toLocaleString()}} Ks per day.</h4>
      <div class="d-flex justify-content-between">
        <div class="div">
          <input
              type="month"
              id="monthPicker"
              v-model="selectedDate"
              class="form-control"
              @change="daysInMonth"
              required
          />
        </div>
        <div class="div">
          <button class="btn text-white" style="background-color: var(--primary);" @click="showCheckinPanel=true" :disabled="this.chosenDateList.length < 1">{{$t('message.reserve')}}</button>
          <router-link :to="{name:'ApartmentReservationList',params:{date_type:'day',selected_date:day}}" class="btn text-white ms-2" style="background-color: var(--dark);">{{$t('message.check_booking')}}</router-link>
        </div>
      </div>
      <div class="row">

        <div class="col-3 col-lg-1 col-md-2 p-2 " v-for="dayy in daysInMonth" :key="dayy.day" @click="chooseDate(dayy.date)">
          <div class="card" :class="chosenDateList.find(d=>d === dayy.date)?'active-card':''">
              <span style="font-weight: 600; font-size: 1.6rem;color: var(--dark); border-bottom: 2px solid var(--side-bar-bg);">{{dayy.day}}</span>
            <div class="d-flex flex-column">

              <div class="ps-2 pb-1" style="color: var(--text-color-light);font-weight: 200; font-size: 12px;">
                {{bookingDateList[bookingDateList.findIndex(bDate => bDate.date === dayy.date)]?.customerName}}
                <br/>
                {{bookingDateList[bookingDateList.findIndex(bDate => bDate.date === dayy.date)]?.customerPhone}}
              </div>
            </div>
            <span class="text-white text-black-50 badge bottom-0 rounded-pill mx-auto px-1 m-1 w-100" style="background-color: var(--green);font-size: 10px;" v-if="bookingDateList.find(bDate => bDate.date === dayy.date) " ><i class="far fa-calendar-check"></i> {{$t('message.reserved')}}</span>
          </div>
        </div>
      </div>

    </div>

  </AdminSidebar>

</template>

<script>
import db, {timestamp} from "@/config/FirebaseInit";
import Loading from "@/components/Loading";
import InfoDialog from "@/components/InfoDialog";
import AdminSidebar from "@/components/AdminSidebar";
export default {
  components:{InfoDialog, Loading, AdminSidebar},
  data(){
    return{
      showCheckinPanel:false,
      showSelectedCheckinPanel:false,
      infoModalActive:false,
      modalMessage:'',
      confirmActive:false,
      loadingActive:false,
      selectedApartment:"",
      selectedDate:new Date(),
      chosenDateList:[],
      bookingDateList:[],
      selectedDayList:[],
      selectedCheckin:'',
      checkIn:{
        id:'',
        customerName:'',
        customerPhone:'',
        description:'',
        numberOfKids:'0',
        numberOfAdults:'0',
        totalAmount:'',
        paidAmount:'',
        status:'book'
      },

    }
  },
  computed:{
    daysInMonth () {
      let chooseDate = new Date(this.selectedDate);
      console.log(chooseDate)
      let days = new Date(chooseDate.getFullYear(), chooseDate.getMonth()+1, 0).getDate();
      let results = []
      for (let i =1; i<=days;i++){
        results.push({day:i,date:(i<10?'0'+i:i)+'-'+this.getSelectedMonthAndYear()})
      }
      return results
    },
    apartmentTypes(){
      return this.$store.getters.getAllApartmentTypes
    },
    owner(){
      return this.$store.getters.getShopOwner;
    },
    currentDateTime(){
      const date = new Date();
      let time = new Intl.DateTimeFormat('en-US',
          {
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
          }).format(date);
      return time;
    },
    shopInfo(){
      return this.$store.getters.getShopInfo;
    },
    dateTime() {
      return this.$store.getters.getDateTime;
    },
    day() {
      return this.$store.getters.getDay;
    },
    month() {
      return this.$store.getters.getMonth;
    },
    year() {
      return this.$store.getters.getYear;
    },

  },
  async mounted() {
    this.$store.dispatch("getDateTime");
    this.$store.dispatch("getDay");
    this.$store.dispatch("getMonth");
    this.$store.dispatch("getYear");
    this.$store.dispatch("getShopInfo", this.owner);
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('apartments').doc(this.$route.params.apartment_id).get().then(snapshot=>{
      this.selectedApartment = snapshot.data();
      console.log('selected apartment', this.selectedApartment)
    });
    await db.collection(this.owner.city).doc(this.owner.shopId).collection('apartments').doc(this.$route.params.apartment_id).collection('reservations').onSnapshot(snapshot=>{
      snapshot.forEach(doc=>{
        console.log(doc.data())
        doc.data().dateList.forEach(date=>{
          this.bookingDateList.push({date:date, customerName:doc.data().customerName, customerPhone:doc.data().customerPhone})
        })
      })
      console.log('booking date list', this.bookingDateList)
    });
  },
  methods:{
    removeLastChosenDate(date){
      if(this.checkIn.id!==''){
        this.selectedCheckin.dateList.splice(this.selectedCheckin.dateList.indexOf(date), 1)
      }else {
       this.chosenDateList.splice(this.chosenDateList.indexOf(date), 1)
      }
    },
    formatDate(payload) {
      const date = new Date(payload);
      let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
          date
      );
      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(
          date
      );
      let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
     return day + "-" + month + "-" + year;
    },
    extendSelectedCheckinDateList(){

      if(this.checkIn.id!==''){
        let finalDate = new Date(this.selectedCheckin.dateList[this.selectedCheckin.dateList.length-1])
        let nextDay = this.formatDate(finalDate.setDate(finalDate.getDate()+1));
        if(!this.bookingDateList.find(bDate=> bDate.date === nextDay)){
          this.selectedCheckin.dateList.push(nextDay)

        }else {
          this.infoModalActive = true;
          this.modalMessage = "Sorry, you can't extend the day reserved by others."
        }
      }else {
        let finalDate = new Date(this.chosenDateList[this.chosenDateList.length-1])
        let nextDay = this.formatDate(finalDate.setDate(finalDate.getDate()+1));
        if(!this.bookingDateList.find(bDate=> bDate.date === nextDay)){
          this.chosenDateList.push(nextDay)
        }else {
          this.infoModalActive = true;
          this.modalMessage = "Sorry, you can't extend the day reserved by others."
        }
      }

    },
    closeCheckinPanel(){
      this.showCheckinPanel =false;
      this.chosenDateList = [];
    },
    async checkedIn(){
      this.loadingActive = true;
      if(this.checkIn.id===""){
        const checkInRef  = db
            .collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('apartments')
            .doc(this.selectedApartment.id)
            .collection('reservations')
            .doc();
        const data = {
          id:checkInRef.id,
          customerName:this.checkIn.customerName,
          customerPhone:this.checkIn.customerPhone,
          description:this.checkIn.description+"",
          numberOfKids:this.checkIn.numberOfKids+"",
          numberOfAdults:this.checkIn.numberOfAdults+"",
          totalAmount:this.checkIn.totalAmount+"",
          paidAmount:this.checkIn.paidAmount+"",
          status:'',
          dateTime: this.dateTime,
          day: this.day,
          month: this.month,
          year: this.year,
          dateList: this.chosenDateList,
          time:timestamp,
          apartmentId: this.selectedApartment.id,
          apartmentName:this.selectedApartment.name,
          apartmentType:this.selectedApartment.apartmentType
        };
        console.log(data);
        await checkInRef
            .set(data)
            .then(() => {
              this.checkIn = {
                id:"",
                customerName: "",
                customerPhone: "",
                totalAmount: "",
                numberOfKids: "0",
                numberOfAdults: "0",
                paidAmount: "",
              };
              this.chosenDateList = [];
              this.loadingActive = false;
              this.showCheckinPanel = false;
              this.infoModalActive = true;
              this.modalMessage = "Reservation Success";
            })
            .catch((error) => {
              this.loadingActive = false;
              this.infoModalActive = true;
              this.modalMessage = "Invalid Data";
              this.error = error;
              this.errorMsg = error.message;
            });
      }else{
        const checkInRef  = db
            .collection(this.owner.city)
            .doc(this.owner.shopId)
            .collection('apartments')
            .doc(this.selectedApartment.id)
            .collection('reservations')
            .doc(this.selectedCheckin.id);
        const data = {
          customerName:this.checkIn.customerName,
          customerPhone:this.checkIn.customerPhone,
          description:this.checkIn.description+"",
          numberOfKids:this.checkIn.numberOfKids+"",
          numberOfAdults:this.checkIn.numberOfAdults+"",
          totalAmount:this.checkIn.totalAmount+"",
          paidAmount:this.checkIn.paidAmount+"",
          status:'',
          dateTime: this.selectedCheckin.dateTime,
          day: this.selectedCheckin.day,
          month: this.selectedCheckin.month,
          year: this.selectedCheckin.year,
          dateList: this.selectedCheckin.dateList,
          time:timestamp,
          apartmentId: this.selectedCheckin.apartmentId,
          apartmentName:this.selectedCheckin.apartmentName,
          apartmentType:this.selectedCheckin.apartmentType
        };
        console.log(data);
        await checkInRef
            .update(data)
            .then(() => {
              this.checkIn = {
                customerName: "",
                customerPhone: "",
                totalAmount: "0",
                numberOfKids: "0",
                numberOfAdults: "",
                paidAmount: "",
              };
              this.selectedCheckin ='';
              this.showCheckinPanel = false;
              this.loadingActive = false;
              this.infoModalActive = true;
              this.modalMessage = "Reservation Updated Successfully";
            })
            .catch((error) => {
              this.loadingActive = false;
              this.infoModalActive = true;
              this.modalMessage = "Invalid Data";
              this.error = error;
              this.errorMsg = error.message;
            });
      }

    },
    getSelectedMonthAndYear(){
      const date = new Date(this.selectedDate);
      let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      return month+"-"+year;
    },
    async chooseDate(day){
      console.log(day)
      await db.collection(this.owner.city).doc(this.owner.shopId).collection('apartments').doc(this.$route.params.apartment_id).collection('reservations').where('dateList','array-contains',day).onSnapshot(snapshot=> {
        if(snapshot.docs.length>0){
          this.selectedCheckin = snapshot.docs[0].data();
          this.checkIn.id = snapshot.docs[0].data().id;
          this.checkIn.customerName=snapshot.docs[0].data().customerName;
          this.checkIn.customerPhone=snapshot.docs[0].data().customerPhone;
          this.checkIn.numberOfKids=snapshot.docs[0].data().numberOfKids;
          this.checkIn.numberOfAdults=snapshot.docs[0].data().numberOfAdults;
          this.checkIn.totalAmount=snapshot.docs[0].data().totalAmount;
          this.checkIn.paidAmount=snapshot.docs[0].data().paidAmount;
          this.showCheckinPanel = true;
        }else {
          this.showCheckinPanel = false;
          this.checkIn.id = '';
          this.checkIn.customerName='';
          this.checkIn.customerPhone='';
          this.numberOfKids='';
          this.checkIn.numberOfAdults='';
          this.checkIn.totalAmount='';
          this.checkIn.paidAmount='';
          if(!this.chosenDateList.find(d=>d===day)){
            let lastDate =  new Date(this.chosenDateList[this.chosenDateList.length-1]);
            let newDate = new Date(day);
            if(this.chosenDateList.length>0){
              if((newDate.getDate() - lastDate.getDate()) != 1){
                this.infoModalActive = true;
                this.modalMessage = "Please select date by order."
              }else {
                this.chosenDateList.push(day)
              }
            }else {
              this.chosenDateList.push(day)
            }

          }else {

            this.chosenDateList.splice(this.chosenDateList.indexOf(day), 1);
          }
        }
      });
    },

    closeModal(){
      this.infoModalActive = !this.infoModalActive;

    },
    cancel(){
      this.confirmActive = !this.confirmActive;

    },
    confirm(){
      this.confirmActive = !this.confirmActive;

    },


  }
}
</script>
<style scoped>
.checkin-modal{
  top:0;
  z-index: 900;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.44);
  position: fixed;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-card{
  width: 700px;
  background-color: var(--light);
  border-radius: 20px !important;
}
.card{
  cursor: pointer;
  min-width: 100px;
  height: 130px;
  box-shadow:0 0 40px -10px rgba(204, 204, 204, 0.6);
  transition: 1s;
  color: var(--text-color);

}
.card span{
  margin: 8px;
  font-weight: 400;
  font-size: 1.2rem;
}

.active-card{
  border:2px solid var(--primary)!important;
}
@media only screen and (max-width: 1030px) {

  .content-box {
    margin-top: 50px;
  }
}
</style>