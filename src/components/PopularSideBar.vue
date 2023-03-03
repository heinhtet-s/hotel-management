<template>
  <div class="col-12 m-0 p-0 col-lg-3 d-none d-lg-block mt-5 popular-box">
    <span class="fs-5 fw-bold d-none d-lg-block p-2 bg-white min-vh-100">New Products</span>
    <div class="row">

    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.popular-box{
  right: 0;
  background-color: white;
  height: 100%;
  box-sizing: border-box;
  position: fixed;
  width: inherit;
  overflow-x: hidden;
  overflow-y: scroll;
}
@media only screen and (max-width: 1030px) {
  .popular-box {
    padding: 0;
    z-index: 5000;
    background-color: var(--light);
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    margin-top: 0px;
    margin-left: 0px;
    height: inherit;
    align-items: center;
  }
}
</style>