<template>
  <div class="todo-app">
    <div class="app-container">
      <!-- 頂部標題和操作區 -->
      <header class="header">
        <div class="header-content">
          <h1 class="title">
            <el-icon class="title-icon"><Calendar /></el-icon>
            <span>每日待辦清單</span>
          </h1>
          <el-button
            type="primary"
            :icon="Plus"
            size="large"
            class="add-button"
            @click="openAddDialog"
          >
            新增待辦
          </el-button>
        </div>
      </header>

      <!-- 主內容區域 -->
      <main class="main-content">
        <!-- 統計資訊卡片 -->
        <div class="stats-section">
          <el-row :gutter="20">
            <el-col :xs="12" :sm="6">
              <div class="stat-card">
                <div class="stat-icon total">
                  <el-icon><List /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ todoStore.todos.length }}</div>
                  <div class="stat-label">總計</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-card">
                <div class="stat-icon pending">
                  <el-icon><Clock /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ todoStore.pendingTodos.length }}</div>
                  <div class="stat-label">待完成</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-card">
                <div class="stat-icon completed">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ todoStore.completedTodos.length }}</div>
                  <div class="stat-label">已完成</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="6">
              <div class="stat-card">
                <div class="stat-icon today">
                  <el-icon><Calendar /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ todoStore.todayTodos.length }}</div>
                  <div class="stat-label">今日待辦</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 列表容器卡片 -->
        <div class="list-section">
          <!-- 篩選和排序工具列 -->
          <div class="toolbar">
            <el-radio-group v-model="filterType" size="default" class="filter-tabs">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button value="pending">待完成</el-radio-button>
              <el-radio-button value="completed">已完成</el-radio-button>
              <el-radio-button value="today">今日</el-radio-button>
            </el-radio-group>

            <div class="toolbar-actions">
              <el-dropdown @command="handleSort" trigger="click">
                <el-button :icon="Sort" class="action-button">
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
                class="action-button clear-button"
                @click="handleClearCompleted"
              >
                清除已完成
              </el-button>
            </div>
          </div>

          <!-- 待辦列表 -->
          <div class="todo-list-wrapper">
            <TodoList
              :todos="filteredTodos"
              @toggle="handleToggle"
              @edit="openEditDialog"
              @delete="handleDelete"
              @add="openAddDialog"
            />
          </div>
        </div>
      </main>
    </div>

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
  List,
  Clock,
  Check,
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
  padding: 24px 16px;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 頭部樣式 */
.header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.title-icon {
  font-size: 42px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.add-button {
  height: 44px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 22px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

/* 主內容區域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 統計卡片區域 */
.stats-section {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon.today {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

/* 列表區域 */
.list-section {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeInUp 0.6s ease 0.1s both;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px;
  flex-wrap: wrap;
  background: linear-gradient(to bottom, #fafafa 0%, white 100%);
}

.filter-tabs {
  flex-shrink: 0;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-button {
  border-radius: 8px;
  font-weight: 500;
}

.clear-button {
  color: #f56c6c;
  border-color: #f56c6c;
}

.clear-button:hover {
  background-color: #fef0f0;
  color: #f56c6c;
  border-color: #f56c6c;
}

.todo-list-wrapper {
  padding: 24px;
  min-height: 400px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .todo-app {
    padding: 16px 12px;
  }

  .header {
    margin-bottom: 24px;
  }

  .title {
    font-size: 28px;
  }

  .title-icon {
    font-size: 32px;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }

  .main-content {
    gap: 20px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }

  .stat-value {
    font-size: 28px;
  }

  .toolbar {
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .filter-tabs {
    width: 100%;
  }

  .filter-tabs :deep(.el-radio-button__inner) {
    padding: 8px 12px;
    font-size: 13px;
  }

  .toolbar-actions {
    width: 100%;
    justify-content: space-between;
  }

  .action-button {
    flex: 1;
  }

  .todo-list-wrapper {
    padding: 16px;
  }
}

@media (max-width: 576px) {
  .filter-tabs :deep(.el-radio-button__inner) {
    padding: 8px 8px;
    font-size: 12px;
  }

  .stat-card {
    padding: 16px;
  }
}
</style>
