<template>
  <div class="content">
    <div class="error">
      <img src="../assets/01da295b2749baa8012034f792b59f.jpg@2o.jpg" alt="" />
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="js"></script>

<style scoped lang="scss">
.content{
  background: #f1f1f1;
  .error {
  width: 1000px;
  height: 900px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 90%;
  }
  a{
    text-decoration: none;
    font-size: 30px;
    color: rgb(122, 122, 122);
    position: relative;
    left: 800px;
    top: -100px;
  }
}
}

</style>
