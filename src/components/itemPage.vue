<template>
  <div class="item">
<!--插槽-->
<slot></slot>
  </div>
  </template>

  <script>
export default{

}
</script>
<style lang="less">
.item{
  height:3.4375rem;
  border: 1px solid rgb(69, 137, 165);
  margin:.3125rem;
  background-color:rgba(87, 153, 219, 0.2);
}
</style>