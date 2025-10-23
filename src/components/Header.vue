<template>
  <header class="header">
    <h1>BUG REPORT</h1>
  </header>
</template>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 76px;
  background: #fff;
  border-bottom: 1px solid #eff1f5;
  z-index: 10;
}

h1 {
  font-weight: 800;
  color: #535764;
  font-size: 20px;
}

@media (max-width: 430px) {
  .header {
    height: 52px;
  }
}
</style>
