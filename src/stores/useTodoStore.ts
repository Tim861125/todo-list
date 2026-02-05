import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, TodoFormData, TodoPriority } from '@/types/todo'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])
  const loading = ref(false)

  // Getters
  const completedTodos = computed(() => todos.value.filter(todo => todo.completed))
  const pendingTodos = computed(() => todos.value.filter(todo => !todo.completed))
  const todayTodos = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return todos.value.filter(todo => todo.dueDate === today)
  })

  // Actions
  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function addTodo(formData: TodoFormData): Todo {
    const now = new Date().toISOString()
    const newTodo: Todo = {
      id: generateId(),
      title: formData.title,
      description: formData.description,
      completed: false,
      priority: formData.priority,
      dueDate: formData.dueDate,
      createdAt: now,
      updatedAt: now,
    }
    todos.value.unshift(newTodo)
    return newTodo
  }

  function updateTodo(id: string, updates: Partial<TodoFormData>): boolean {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index === -1) return false

    todos.value[index] = {
      ...todos.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return true
  }

  function toggleTodoStatus(id: string): boolean {
    const todo = todos.value.find(todo => todo.id === id)
    if (!todo) return false

    todo.completed = !todo.completed
    todo.updatedAt = new Date().toISOString()
    return true
  }

  function deleteTodo(id: string): boolean {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index === -1) return false

    todos.value.splice(index, 1)
    return true
  }

  function getTodoById(id: string): Todo | undefined {
    return todos.value.find(todo => todo.id === id)
  }

  function clearCompleted(): void {
    todos.value = todos.value.filter(todo => !todo.completed)
  }

  // 排序功能
  function sortByPriority(): void {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    todos.value.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  function sortByDueDate(): void {
    todos.value.sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }

  return {
    // State
    todos,
    loading,
    // Getters
    completedTodos,
    pendingTodos,
    todayTodos,
    // Actions
    addTodo,
    updateTodo,
    toggleTodoStatus,
    deleteTodo,
    getTodoById,
    clearCompleted,
    sortByPriority,
    sortByDueDate,
  }
})
