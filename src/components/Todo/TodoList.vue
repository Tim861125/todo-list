<template>
  <div class="todo-list">
    <div v-if="todos.length === 0" class="empty-state">
      <el-empty description="暫無待辦事項">
        <el-button type="primary" @click="$emit('add')">
          新增第一個待辦事項
        </el-button>
      </el-empty>
    </div>

    <transition-group v-else name="list" tag="div">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '@/types/todo'
import TodoItem from './TodoItem.vue'

interface Props {
  todos: Todo[]
}

interface Emits {
  (e: 'toggle', id: string): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: string): void
  (e: 'add'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.todo-list {
  width: 100%;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

/* 列表過渡動畫 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
