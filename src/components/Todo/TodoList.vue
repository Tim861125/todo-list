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
import type { Todo } from "@/types/todo";
import TodoItem from "./TodoItem.vue";

interface Props {
  todos: Todo[];
}

interface Emits {
  (e: "toggle", id: string): void;
  (e: "edit", todo: Todo): void;
  (e: "delete", id: string): void;
  (e: "add"): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.todo-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.empty-state :deep(.el-empty) {
  padding: 0;
}

.empty-state :deep(.el-empty__image) {
  width: 160px;
  height: 160px;
  opacity: 0.6;
}

.empty-state :deep(.el-empty__description) {
  font-size: 16px;
  color: #90a4ae;
  margin-top: 20px;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(144, 164, 174, 0.3);
}

.empty-state :deep(.el-button) {
  margin-top: 24px;
  height: 44px;
  padding: 0 32px;
  font-size: 15px;
  border-radius: 22px;
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  border: 1px solid rgba(100, 181, 246, 0.3);
  color: white;
  box-shadow:
    0 4px 12px rgba(30, 136, 229, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.empty-state :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(30, 136, 229, 0.6),
    0 0 30px rgba(66, 165, 245, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #4fc3f7 0%, #2196f3 100%);
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
