<template>
  <div class="modal">
    <transition name="bounce">
      <div class="card rounded shadow-lg">
        <div class="d-flex flex-column card-body text-center justify-content-center align-items-center">
          <Vue3Lottie :animationData="info" :height="100" :width="100" />
          <p class="fs-6 fw-bolder my-3">{{this.modalMessage}}</p>
          <button id="close_button" @click="closeModal"  class="btn" style="background-color: var(--btnLight);">{{ $t('message.close') }}</button>
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
  name:"InfoDialog",
  props:["modalMessage"],
  methods:{
    closeModal(){
      this.$emit("close-modal")
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
  width: 300px;
  height: 300px;
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