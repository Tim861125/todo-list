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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

#app {
  min-height: 100vh;
  width: 100%;
}
</style>
