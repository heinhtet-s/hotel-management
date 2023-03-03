<template>
  <div class="modal">
    <div class="card rounded shadow-lg">
      <div class="d-flex flex-column card-body text-center justify-content-center align-items-center">
        <Vue3Lottie :animationData="info" :height="100" :width="100" />
        <p class="fs-6 fw-bolder my-3" style="color: var(--text-color);">{{modalMessage}}</p>
        <div class="d-flex p-1 mt-3 justify-content-between">
          <button id="cancel-button" @click="cancel" class="btn border-2 mx-2" style="background-color: var(--softPrimary);">{{$t('message.no')}}</button>

          <button @click="confirm" class="btn mx-2 text-light" style="background-color: var(--primary)">{{$t('message.yes')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const info = require('../assets/lotties/info.json')
export default {
  data(){
    return{
      info,
    }
  },
  name:"ConfirmDialog",
  props:["modalMessage"],
  methods:{
    confirm(){
      this.$emit("confirm")
    },
    cancel(){
      this.$emit("cancel")
    }
  },
  mounted() {
    document.getElementById("cancel-button").focus();

  }
}
</script>

<style scoped>
.modal{
  top:0;
  z-index: 999999;
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.2);
  backdrop-filter: blur(3px);

  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card{
  border-radius: 20px !important;
  width: 350px;
  height: 300px;
}
button{
  width:150px;
  border-radius: var(--border-radius) !important;
}
</style>