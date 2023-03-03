<template>
  <div class="modal">
    <div class="card p-4 text-center" style="background-color: var(--background-color)!important;">
      <Vue3Lottie :animationData="loading" :speed="2" :height="150" :width="150" />
    </div>
  </div>
</template>

<script>
const loading = require("../assets/lotties/loading.json")
export default {
  name:"loading",
  data(){
    return{
      loading,
    }
  }
}
</script>

<style scoped>
.card{
  border-radius: 20px !important;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
}
.loading {
  top: 0;
  z-index: 10000;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
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
span {
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid var(--primary);
  border-bottom: 10px solid var(--primary);
  width: 60px;
  height: 60px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin ease 1000ms  infinite;
}
/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>