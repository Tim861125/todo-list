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
  padding: 80px 20px;
  text-align: center;
}

.empty-state :deep(.el-empty) {
  padding: 40px 0;
}

.empty-state :deep(.el-empty__image) {
  width: 160px;
  height: 160px;
}

.empty-state :deep(.el-empty__description) {
  font-size: 16px;
  color: #909399;
  margin-top: 20px;
  font-weight: 500;
}

.empty-state :deep(.el-button) {
  margin-top: 24px;
  height: 44px;
  padding: 0 32px;
  font-size: 15px;
  border-radius: 22px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.empty-state :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

/* 列表過渡動畫 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
