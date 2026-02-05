<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditMode ? '編輯待辦事項' : '新增待辦事項'"
    width="500px"
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
</style>
