<template>
  <div class="modal">
    <transition name="bounce">
      <div class="card d-flex rounded shadow-lg">
        <div class="row px-5 pt-3">
          <div class="d-flex mb-3 justify-content-between align-items-center w-100">
            <h3>{{ $t('message.booking_alert') }}</h3>
            <span id="close_button" @click="closeModal"  class="btn"><i class="fas fa-times fa-2x"></i></span>
          </div>

          <div class="col-12 col-md-6 mb-3">
            <h4>{{$t('message.customer_info')}}</h4>
            <table class="table table-striped">
              <tbody>
              <tr>
                <td class="text-start">{{$t('message.name')}}</td>
                <td class="text-start">: {{reservedInfo.customerName}}</td>
              </tr>
              <tr>
                <td class="text-start">{{ $t('message.phone') }}</td>
                <td class="text-start">: {{reservedInfo.customerPhone}}</td>
              </tr>
              <tr>
                <td class="text-start">{{$t('message.status')}}</td>
                <td class="text-start">
                  <span class="badge rounded" style="background-color: var(--primaryLight);">{{reservedInfo.status}}</span>

                </td>

              </tr>
              <tr>
                <td class="text-start">{{$t('message.date')}}</td>
                <td class="text-start">: <span>{{reservedInfo.startTime}} {{reservedInfo.startDate}}</span>
                </td>
              </tr>

              </tbody>
            </table>

          </div>
          <div class="col-12 col-md-6 border border-1 rounded" style="height: 200px;overflow-y: scroll;">
            <h4>{{ $t('message.menu') }}</h4>
            <div class="mb-1 p-2" style="background-color: var(--light);border-radius: var(--border-radius);" v-for="menu in reservedMenus" :key="menu.id">
              <span>{{menu.itemName}} x {{menu.count}}</span>
            </div>
          </div>
          <div class="col-12 mt-3">
            <div class="d-flex w-100 justify-content-between align-items-center">

              <button id="close_button" @click="reject"  class="btn btn-danger text-white">{{ $t('message.reject') }}</button>


              <button id="close_button" @click="reserve"  class="btn text-white" style="background-color: var(--primary);">{{ $t('message.serve_now') }}</button>


            </div>

          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
const info = require("../assets/lotties/info.json");
export default {
  data(){
    return{
      info,
    }
  },
  name:"TableReservationReminder",
  props:{
    reservedInfo:{
      type:Object,
      default: () => ({}),
    },
    reservedMenus:{
      type:Array,
      default: () => [],
      required:false
    }
  },

  methods:{
    closeModal(){
      this.$emit("close-modal")
    },
    reserve(){
      this.$emit("reserve")
    },
    reject(){
      this.$emit("reject")
    }
  },
  mounted() {
    window.document.getElementById("close_button").focus();
  }
}
</script>

<style scoped>
.modal{
  top:0;
  z-index: 999999;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.6);
  /*backdrop-filter: blur(3px);*/
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card{
  z-index: 999999;
  background-color: var(--light);
  color: var(--text-color);
  border-radius: 20px !important;
  width: 50vw;
  height: 60vh;
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