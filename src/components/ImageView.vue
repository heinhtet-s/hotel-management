<template>
  <div class="modal">
    <transition name="bounce">
      <div class="card rounded shadow-lg">
        <div class="d-flex flex-column card-body">
          <div class="d-flex justify-content-end">
            <button id="close_button" @click="closeModal" class="btn"><i class="fas fa-times"></i></button>
          </div>
          <img :src="image" style="width: 100%; background-size: cover; max-height: 80vh;" alt="">
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name:"ImageView",
  props:["image"],
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
  background-color: rgba(0, 0, 0, 0.47);
  /*backdrop-filter: blur(3px);*/
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card{
  border-radius: 0px !important;
  width: 400px;
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