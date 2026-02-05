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
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  overflow: hidden;
}

.todo-item:hover {
  border-color: #e0e6ff;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.12);
  transform: translateY(-2px);
}

.todo-item.completed {
  opacity: 0.7;
  background: linear-gradient(to right, #f8f9fa 0%, white 100%);
}

.todo-item.completed:hover {
  border-color: #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  color: #303133;
  line-height: 1.5;
}

.todo-title.completed-text {
  text-decoration: line-through;
  color: #909399;
  font-weight: 500;
}

.todo-description {
  font-size: 14px;
  color: #606266;
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
  color: #606266;
  padding: 4px 10px;
  border-radius: 6px;
  background: #f5f7fa;
  font-weight: 500;
}

.due-date .el-icon {
  font-size: 14px;
}

.due-date.overdue {
  color: #f56c6c;
  background: #fef0f0;
}

.due-date.today {
  color: #e6a23c;
  background: #fdf6ec;
}

.due-date.soon {
  color: #409eff;
  background: #ecf5ff;
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
}

.todo-item :deep(.el-checkbox) {
  height: 20px;
}

.todo-item :deep(.el-checkbox__inner) {
  width: 20px;
  height: 20px;
  border-width: 2px;
  border-radius: 6px;
}

.todo-item :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #67c23a;
  border-color: #67c23a;
}

.todo-item :deep(.el-tag) {
  font-weight: 600;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
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
