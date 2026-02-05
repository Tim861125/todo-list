<script setup lang="ts">
import TodoApp from "./components/Todo/TodoApp.vue";
</script>

<template>
  <TodoApp />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, "Noto Sans TC", sans-serif;
  background: #0a0e27;
  background-image:
    radial-gradient(ellipse at top, #1a1f3a 0%, transparent 50%),
    radial-gradient(ellipse at bottom, #0d1228 0%, transparent 50%);
  background-attachment: fixed;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
