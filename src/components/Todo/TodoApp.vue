<template>
  <div class="todo-app">
    <el-container>
      <!-- 頂部標題和操作區 -->
      <el-header class="header">
        <div class="header-content">
          <h1 class="title">
            <el-icon><Calendar /></el-icon>
            每日待辦清單
          </h1>
          <div class="header-actions">
            <el-button
              type="primary"
              :icon="Plus"
              @click="openAddDialog"
            >
              新增待辦
            </el-button>
          </div>
        </div>
      </el-header>

      <el-main class="main">
        <!-- 統計資訊 -->
        <el-row :gutter="16" class="stats">
          <el-col :xs="12" :sm="6">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-label">總計</div>
                <div class="stat-value">{{ todoStore.todos.length }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-label">待完成</div>
                <div class="stat-value text-primary">{{ todoStore.pendingTodos.length }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-label">已完成</div>
                <div class="stat-value text-success">{{ todoStore.completedTodos.length }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6">
            <el-card shadow="hover">
              <div class="stat-item">
                <div class="stat-label">今日待辦</div>
                <div class="stat-value text-warning">{{ todoStore.todayTodos.length }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 篩選和排序 -->
        <el-card class="filter-bar" shadow="never">
          <div class="filter-content">
            <el-radio-group v-model="filterType" size="default">
              <el-radio-button value="all">全部 ({{ todoStore.todos.length }})</el-radio-button>
              <el-radio-button value="pending">待完成 ({{ todoStore.pendingTodos.length }})</el-radio-button>
              <el-radio-button value="completed">已完成 ({{ todoStore.completedTodos.length }})</el-radio-button>
              <el-radio-button value="today">今日 ({{ todoStore.todayTodos.length }})</el-radio-button>
            </el-radio-group>

            <div class="filter-actions">
              <el-dropdown @command="handleSort">
                <el-button :icon="Sort">
                  排序
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="priority">
                      <el-icon><Star /></el-icon>
                      依優先級
                    </el-dropdown-item>
                    <el-dropdown-item command="dueDate">
                      <el-icon><Calendar /></el-icon>
                      依截止日期
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <el-button
                v-if="todoStore.completedTodos.length > 0"
                :icon="Delete"
                @click="handleClearCompleted"
              >
                清除已完成
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 待辦列表 -->
        <div class="todo-list-container">
          <TodoList
            :todos="filteredTodos"
            @toggle="handleToggle"
            @edit="openEditDialog"
            @delete="handleDelete"
            @add="openAddDialog"
          />
        </div>
      </el-main>
    </el-container>

    <!-- 新增/編輯對話框 -->
    <TodoForm
      v-model:visible="dialogVisible"
      :edit-todo="currentEditTodo"
      @submit="handleAddTodo"
      @update="handleUpdateTodo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Calendar,
  Sort,
  ArrowDown,
  Star,
  Delete,
} from '@element-plus/icons-vue'
import { useTodoStore } from '@/stores/useTodoStore'
import type { Todo, TodoFormData } from '@/types/todo'
import TodoList from './TodoList.vue'
import TodoForm from './TodoForm.vue'

const todoStore = useTodoStore()

const dialogVisible = ref(false)
const currentEditTodo = ref<Todo | null>(null)
const filterType = ref<'all' | 'pending' | 'completed' | 'today'>('all')

const filteredTodos = computed(() => {
  switch (filterType.value) {
    case 'pending':
      return todoStore.pendingTodos
    case 'completed':
      return todoStore.completedTodos
    case 'today':
      return todoStore.todayTodos
    default:
      return todoStore.todos
  }
})

function openAddDialog() {
  currentEditTodo.value = null
  dialogVisible.value = true
}

function openEditDialog(todo: Todo) {
  currentEditTodo.value = todo
  dialogVisible.value = true
}

function handleAddTodo(formData: TodoFormData) {
  todoStore.addTodo(formData)
}

function handleUpdateTodo(id: string, formData: TodoFormData) {
  const success = todoStore.updateTodo(id, formData)
  if (!success) {
    ElMessage.error('更新失敗')
  }
}

function handleToggle(id: string) {
  const success = todoStore.toggleTodoStatus(id)
  if (!success) {
    ElMessage.error('操作失敗')
  }
}

function handleDelete(id: string) {
  const success = todoStore.deleteTodo(id)
  if (success) {
    ElMessage.success('刪除成功')
  } else {
    ElMessage.error('刪除失敗')
  }
}

function handleSort(command: string) {
  if (command === 'priority') {
    todoStore.sortByPriority()
    ElMessage.success('已依優先級排序')
  } else if (command === 'dueDate') {
    todoStore.sortByDueDate()
    ElMessage.success('已依截止日期排序')
  }
}

function handleClearCompleted() {
  ElMessageBox.confirm(
    `確定要清除所有已完成的待辦事項嗎？（共 ${todoStore.completedTodos.length} 項）`,
    '確認清除',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    todoStore.clearCompleted()
    ElMessage.success('已清除所有已完成項目')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
.todo-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.el-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  height: auto;
  padding: 20px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.title .el-icon {
  font-size: 36px;
}

.main {
  padding: 20px 0;
}

.stats {
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-value.text-primary {
  color: #409eff;
}

.stat-value.text-success {
  color: #67c23a;
}

.stat-value.text-warning {
  color: #e6a23c;
}

.filter-bar {
  margin-bottom: 24px;
}

.filter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.todo-list-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
}

@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .filter-content {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
