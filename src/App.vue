<template>
  <router-view/>
</template>
<script>
export default {
  created() {
    document.title = this.$store.state.titles.mainTitle;
  },
};
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F2F2F2;
  min-height: 100%;
}
.btn:focus, button:focus, select:focus {
  -webkit-box-shadow: none!important;
  box-shadow: none!important;
}
.btn {
  padding: 14px 16px;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  border-radius: 8px;
  max-width: 260px;
  width: 100%;
}
.btn.btn--primary {
  background-color: #C31419;
  color: #fff;
}
.btn.btn--secondary {
  background-color: #F2F2F2;
  color: #000;
}

.modal-backdrop {
  z-index: 999;
}

input,
textarea,
select {
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  border: 2px solid #F2F2F2;
  border-radius: 8px;
  padding: 12px 14px;
}
</style>
