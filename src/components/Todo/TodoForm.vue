<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? '編輯待辦事項' : '新增待辦事項'"
    width="520px"
    :close-on-click-modal="false"
    class="todo-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="標題" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="請輸入待辦事項標題"
          clearable
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="請輸入詳細描述（選填）"
        />
      </el-form-item>

      <el-form-item label="優先級" prop="priority">
        <el-select v-model="formData.priority" placeholder="請選擇優先級">
          <el-option label="低" value="low">
            <el-tag type="info" size="small">低</el-tag>
          </el-option>
          <el-option label="中" value="medium">
            <el-tag type="warning" size="small">中</el-tag>
          </el-option>
          <el-option label="高" value="high">
            <el-tag type="danger" size="small">高</el-tag>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="截止日期" prop="dueDate">
        <el-date-picker
          v-model="formData.dueDate"
          type="date"
          placeholder="請選擇截止日期（選填）"
          style="width: 100%"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ isEditMode ? '更新' : '新增' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { TodoFormData, Todo } from '@/types/todo'
import { TodoPriority } from '@/types/todo'

interface Props {
  visible: boolean
  editTodo?: Todo | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', formData: TodoFormData): void
  (e: 'update', id: string, formData: TodoFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const isEditMode = ref(false)

const formData = reactive<TodoFormData>({
  title: '',
  description: '',
  priority: TodoPriority.MEDIUM,
  dueDate: '',
})

const rules: FormRules = {
  title: [
    { required: true, message: '請輸入待辦事項標題', trigger: 'blur' },
    { min: 1, max: 100, message: '標題長度應在 1 到 100 個字之間', trigger: 'blur' },
  ],
  priority: [
    { required: true, message: '請選擇優先級', trigger: 'change' },
  ],
}

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val && props.editTodo) {
    isEditMode.value = true
    formData.title = props.editTodo.title
    formData.description = props.editTodo.description || ''
    formData.priority = props.editTodo.priority
    formData.dueDate = props.editTodo.dueDate || ''
  } else if (val) {
    isEditMode.value = false
    resetForm()
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

function resetForm() {
  formData.title = ''
  formData.description = ''
  formData.priority = TodoPriority.MEDIUM
  formData.dueDate = ''
  formRef.value?.clearValidate()
}

function handleClose() {
  dialogVisible.value = false
  resetForm()
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEditMode.value && props.editTodo) {
        emit('update', props.editTodo.id, { ...formData })
        ElMessage.success('更新成功')
      } else {
        emit('submit', { ...formData })
        ElMessage.success('新增成功')
      }
      handleClose()
    }
  })
}
</script>

<style scoped>
.el-select {
  width: 100%;
}

:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
  border-bottom: 1px solid rgba(100, 181, 246, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  padding: 24px 28px;
  margin: 0;
  position: relative;
}

:deep(.el-dialog__header)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.5), transparent);
}

:deep(.el-dialog__title) {
  color: #e8eaf6;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(100, 181, 246, 0.3);
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #90caf9;
  font-size: 20px;
  transition: all 0.3s;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #64b5f6;
  filter: drop-shadow(0 0 8px rgba(100, 181, 246, 0.6));
}

:deep(.el-dialog__body) {
  padding: 28px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
}

:deep(.el-dialog__footer) {
  padding: 20px 28px 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  border-top: 1px solid rgba(100, 181, 246, 0.1);
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #90caf9;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid rgba(100, 181, 246, 0.2);
  background: rgba(15, 23, 42, 0.6);
  color: #e8eaf6;
  transition: all 0.3s;
}

:deep(.el-input__inner::placeholder),
:deep(.el-textarea__inner::placeholder) {
  color: #607d8b;
}

:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus) {
  border-color: rgba(100, 181, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.1), 0 0 20px rgba(100, 181, 246, 0.2);
  background: rgba(15, 23, 42, 0.8);
}

:deep(.el-select .el-input__inner) {
  cursor: pointer;
}

:deep(.el-input__wrapper) {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 181, 246, 0.2);
  box-shadow: none;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(100, 181, 246, 0.4);
}

:deep(.el-input.is-focus .el-input__wrapper) {
  border-color: rgba(100, 181, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.1), 0 0 20px rgba(100, 181, 246, 0.2);
  background: rgba(15, 23, 42, 0.8);
}

:deep(.el-textarea__inner) {
  background: rgba(15, 23, 42, 0.6);
  color: #e8eaf6;
}

:deep(.el-input__inner) {
  color: #e8eaf6;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-select-dropdown) {
  background: rgba(30, 41, 59, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 181, 246, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

:deep(.el-select-dropdown__item) {
  color: #90caf9;
  transition: all 0.3s;
}

:deep(.el-select-dropdown__item:hover) {
  background: rgba(100, 181, 246, 0.15);
  color: #e3f2fd;
}

:deep(.el-select-dropdown__item.is-selected) {
  background: rgba(100, 181, 246, 0.2);
  color: #64b5f6;
  font-weight: 600;
}

:deep(.el-picker-panel) {
  background: rgba(30, 41, 59, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(100, 181, 246, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  color: #e8eaf6;
}

:deep(.el-date-picker__header-label),
:deep(.el-picker-panel__icon-btn) {
  color: #90caf9;
}

:deep(.el-date-table th) {
  color: #607d8b;
}

:deep(.el-date-table td.available:hover) {
  background: rgba(100, 181, 246, 0.15);
}

:deep(.el-date-table td.current) {
  background: rgba(100, 181, 246, 0.2);
  color: #64b5f6;
}

:deep(.el-date-table td.today span) {
  color: #ffb74d;
  font-weight: 600;
}

:deep(.el-button) {
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  border: 1px solid rgba(100, 181, 246, 0.3);
  color: white;
  box-shadow:
    0 4px 12px rgba(30, 136, 229, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(30, 136, 229, 0.6),
    0 0 30px rgba(66, 165, 245, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #4fc3f7 0%, #2196f3 100%);
}

:deep(.el-button--default) {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(100, 181, 246, 0.2);
  color: #90caf9;
}

:deep(.el-button--default:hover) {
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(100, 181, 246, 0.4);
  color: #e3f2fd;
  box-shadow: 0 0 15px rgba(100, 181, 246, 0.2);
}

@media (max-width: 576px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-form-item__label) {
    text-align: left;
  }
}
</style>
