<template>
  <el-card class="todo-item" :class="{ 'completed': todo.completed }">
    <div class="todo-content">
      <div class="todo-left">
        <el-checkbox
          :model-value="todo.completed"
          @change="handleToggle"
          size="large"
        />
        <div class="todo-info">
          <div class="todo-title" :class="{ 'completed-text': todo.completed }">
            {{ todo.title }}
          </div>
          <div v-if="todo.description" class="todo-description">
            {{ todo.description }}
          </div>
          <div class="todo-meta">
            <el-tag
              :type="priorityType"
              size="small"
              effect="plain"
            >
              {{ priorityLabel }}
            </el-tag>
            <span v-if="todo.dueDate" class="due-date" :class="dueDateClass">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(todo.dueDate) }}
            </span>
          </div>
        </div>
      </div>
      <div class="todo-actions">
        <el-button
          type="primary"
          :icon="Edit"
          circle
          size="small"
          @click="handleEdit"
        />
        <el-button
          type="danger"
          :icon="Delete"
          circle
          size="small"
          @click="handleDelete"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Edit, Delete, Calendar } from '@element-plus/icons-vue'
import type { Todo } from '@/types/todo'
import { TodoPriority } from '@/types/todo'

interface Props {
  todo: Todo
}

interface Emits {
  (e: 'toggle', id: string): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const priorityType = computed(() => {
  switch (props.todo.priority) {
    case TodoPriority.HIGH:
      return 'danger'
    case TodoPriority.MEDIUM:
      return 'warning'
    case TodoPriority.LOW:
      return 'info'
    default:
      return 'info'
  }
})

const priorityLabel = computed(() => {
  switch (props.todo.priority) {
    case TodoPriority.HIGH:
      return '高'
    case TodoPriority.MEDIUM:
      return '中'
    case TodoPriority.LOW:
      return '低'
    default:
      return '中'
  }
})

const dueDateClass = computed(() => {
  if (!props.todo.dueDate || props.todo.completed) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(props.todo.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'today'
  if (diffDays <= 3) return 'soon'
  return ''
})

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '明天'
  if (diffDays === -1) return '昨天'

  return date.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })
}

function handleToggle() {
  emit('toggle', props.todo.id)
}

function handleEdit() {
  emit('edit', props.todo)
}

function handleDelete() {
  ElMessageBox.confirm(
    '確定要刪除這個待辦事項嗎？',
    '確認刪除',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    emit('delete', props.todo.id)
  }).catch(() => {
    // 取消刪除
  })
}
</script>

<style scoped>
.todo-item {
  margin-bottom: 16px;
  border-radius: 12px;
  border: 1px solid rgba(100, 181, 246, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.6) 100%);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.todo-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.todo-item:hover::before {
  opacity: 1;
}

.todo-item:hover {
  border-color: rgba(100, 181, 246, 0.4);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(100, 181, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.todo-item.completed {
  opacity: 0.5;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%);
}

.todo-item.completed:hover {
  border-color: rgba(100, 181, 246, 0.2);
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.todo-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 4px;
}

.todo-left {
  display: flex;
  gap: 14px;
  flex: 1;
  min-width: 0;
  align-items: flex-start;
}

.todo-info {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}

.todo-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  word-break: break-word;
  color: #e8eaf6;
  line-height: 1.5;
  text-shadow: 0 0 5px rgba(100, 181, 246, 0.2);
}

.todo-title.completed-text {
  text-decoration: line-through;
  color: #78909c;
  font-weight: 500;
  text-shadow: none;
}

.todo-description {
  font-size: 14px;
  color: #90a4ae;
  margin-bottom: 10px;
  word-break: break-word;
  line-height: 1.6;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.due-date {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #90a4ae;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(100, 181, 246, 0.1);
  font-weight: 500;
}

.due-date .el-icon {
  font-size: 14px;
}

.due-date.overdue {
  color: #ef5350;
  background: rgba(211, 47, 47, 0.15);
  border-color: rgba(239, 83, 80, 0.3);
  box-shadow: 0 0 10px rgba(239, 83, 80, 0.2);
}

.due-date.today {
  color: #ffb74d;
  background: rgba(245, 124, 0, 0.15);
  border-color: rgba(255, 183, 77, 0.3);
  box-shadow: 0 0 10px rgba(255, 183, 77, 0.2);
}

.due-date.soon {
  color: #64b5f6;
  background: rgba(25, 118, 210, 0.15);
  border-color: rgba(100, 181, 246, 0.3);
  box-shadow: 0 0 10px rgba(100, 181, 246, 0.2);
}

.todo-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

/* 深度選擇器用於 Element Plus 組件 */
.todo-item :deep(.el-card__body) {
  padding: 20px;
  background: transparent;
}

.todo-item :deep(.el-checkbox) {
  height: 20px;
}

.todo-item :deep(.el-checkbox__inner) {
  width: 20px;
  height: 20px;
  border-width: 2px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(100, 181, 246, 0.3);
  transition: all 0.3s;
}

.todo-item :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #81c784;
  border-color: #81c784;
  box-shadow: 0 0 15px rgba(129, 199, 132, 0.6);
}

.todo-item :deep(.el-checkbox__inner::after) {
  border-color: #e8eaf6;
}

.todo-item :deep(.el-tag) {
  font-weight: 600;
  border: 1px solid;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.5);
}

.todo-item :deep(.el-tag--danger) {
  color: #ef5350;
  border-color: rgba(239, 83, 80, 0.3);
  background: rgba(211, 47, 47, 0.15);
}

.todo-item :deep(.el-tag--warning) {
  color: #ffb74d;
  border-color: rgba(255, 183, 77, 0.3);
  background: rgba(245, 124, 0, 0.15);
}

.todo-item :deep(.el-tag--info) {
  color: #90a4ae;
  border-color: rgba(144, 164, 174, 0.3);
  background: rgba(69, 90, 100, 0.15);
}

@media (max-width: 768px) {
  .todo-content {
    gap: 12px;
  }

  .todo-left {
    gap: 10px;
  }

  .todo-actions {
    flex-direction: column;
    gap: 6px;
  }

  .todo-actions {
    opacity: 1;
  }
}
</style>
