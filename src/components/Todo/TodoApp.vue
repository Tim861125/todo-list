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
  height: 100vh;
  padding: 24px 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 頭部樣式 */
.header {
  margin-bottom: 24px;
  flex-shrink: 0;
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
  color: #e8eaf6;
  margin: 0;
  text-shadow:
    0 0 20px rgba(100, 200, 255, 0.5),
    0 0 40px rgba(100, 200, 255, 0.3);
  letter-spacing: 1px;
}

.title-icon {
  font-size: 42px;
  color: #64b5f6;
  filter: drop-shadow(0 0 10px rgba(100, 181, 246, 0.8));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.add-button {
  height: 44px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 22px;
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  border: 1px solid rgba(100, 181, 246, 0.3);
  box-shadow:
    0 4px 12px rgba(30, 136, 229, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(30, 136, 229, 0.6),
    0 0 30px rgba(66, 165, 245, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #4fc3f7 0%, #2196f3 100%);
}

/* 主內容區域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 統計卡片區域 */
.stats-section {
  animation: fadeInUp 0.6s ease;
  flex-shrink: 0;
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
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 181, 246, 0.1);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.1), transparent);
  transition: left 0.5s;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(100, 181, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-color: rgba(100, 181, 246, 0.3);
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
  position: relative;
  z-index: 1;
}

.stat-icon.total {
  background: linear-gradient(135deg, #64b5f6 0%, #1976d2 100%);
  box-shadow: 0 0 20px rgba(100, 181, 246, 0.5);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #4dd0e1 0%, #0097a7 100%);
  box-shadow: 0 0 20px rgba(77, 208, 225, 0.5);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #81c784 0%, #388e3c 100%);
  box-shadow: 0 0 20px rgba(129, 199, 132, 0.5);
}

.stat-icon.today {
  background: linear-gradient(135deg, #ffb74d 0%, #f57c00 100%);
  box-shadow: 0 0 20px rgba(255, 183, 77, 0.5);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #e8eaf6;
  line-height: 1;
  margin-bottom: 6px;
  text-shadow: 0 0 10px rgba(100, 181, 246, 0.3);
}

.stat-label {
  font-size: 14px;
  color: #90a4ae;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 列表區域 */
.list-section {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 181, 246, 0.15);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  animation: fadeInUp 0.6s ease 0.1s both;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(100, 181, 246, 0.1);
  gap: 16px;
  flex-wrap: wrap;
  background: linear-gradient(to bottom, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%);
  flex-shrink: 0;
}

.filter-tabs {
  flex-shrink: 0;
}

.filter-tabs :deep(.el-radio-button__inner) {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 181, 246, 0.2);
  color: #90caf9;
  transition: all 0.3s;
}

.filter-tabs :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-left: 1px solid rgba(100, 181, 246, 0.2);
}

.filter-tabs :deep(.el-radio-button__inner:hover) {
  color: #e3f2fd;
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(100, 181, 246, 0.3);
}

.filter-tabs :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, rgba(66, 165, 245, 0.3) 0%, rgba(30, 136, 229, 0.3) 100%);
  border-color: rgba(100, 181, 246, 0.5);
  color: #64b5f6;
  box-shadow:
    0 0 15px rgba(100, 181, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-button {
  border-radius: 8px;
  font-weight: 500;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(100, 181, 246, 0.2);
  color: #90caf9;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(100, 181, 246, 0.4);
  box-shadow: 0 0 20px rgba(100, 181, 246, 0.3);
  color: #e3f2fd;
}

.clear-button {
  color: #ef5350;
  border-color: rgba(239, 83, 80, 0.3);
}

.clear-button:hover {
  background: rgba(211, 47, 47, 0.1);
  color: #ef5350;
  border-color: rgba(239, 83, 80, 0.5);
  box-shadow: 0 0 20px rgba(239, 83, 80, 0.3);
}

.todo-list-wrapper {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.todo-list-wrapper::-webkit-scrollbar {
  width: 8px;
}

.todo-list-wrapper::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 4px;
}

.todo-list-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(100, 181, 246, 0.3) 0%, rgba(66, 165, 245, 0.5) 100%);
  border-radius: 4px;
  border: 1px solid rgba(100, 181, 246, 0.1);
}

.todo-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(100, 181, 246, 0.5) 0%, rgba(66, 165, 245, 0.7) 100%);
  box-shadow: 0 0 10px rgba(100, 181, 246, 0.5);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .todo-app {
    padding: 16px 12px;
  }

  .header {
    margin-bottom: 16px;
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
    gap: 16px;
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
