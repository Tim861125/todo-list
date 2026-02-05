# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個使用 Vue 3 + TypeScript + Vite 構建的待辦清單應用程式，採用 Element Plus 作為 UI 框架，使用 Pinia 進行狀態管理。

## 開發指令

```bash
# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

## 技術棧

- **前端框架**: Vue 3 (使用 Composition API 和 `<script setup>`)
- **類型檢查**: TypeScript
- **建置工具**: Vite
- **UI 框架**: Element Plus
- **狀態管理**: Pinia
- **圖標**: @element-plus/icons-vue

## 架構設計

### 狀態管理架構

應用程式使用 Pinia 進行集中式狀態管理，主要的 store 位於 `src/stores/useTodoStore.ts`：

- **狀態 (State)**: `todos` (待辦事項陣列)、`loading` (載入狀態)
- **計算屬性 (Getters)**: `completedTodos`、`pendingTodos`、`todayTodos`
- **操作 (Actions)**: CRUD 操作、排序功能、批次刪除

### 元件結構

```
src/
├── App.vue                      # 根元件，引入 TodoApp
├── main.ts                      # 應用程式入口點
├── components/
│   └── Todo/
│       ├── TodoApp.vue          # 主容器元件（統計、篩選、排序）
│       ├── TodoList.vue         # 待辦清單容器
│       ├── TodoItem.vue         # 單個待辦項目
│       └── TodoForm.vue         # 新增/編輯表單對話框
├── stores/
│   └── useTodoStore.ts          # Pinia store（核心業務邏輯）
└── types/
    └── todo.ts                  # 類型定義（Todo、TodoPriority、TodoFormData）
```

### 元件職責劃分

- **TodoApp**: 頂層容器，負責統計顯示、篩選器、排序功能，協調子元件互動
- **TodoList**: 列表容器，處理空狀態顯示，將待辦事項映射到 TodoItem
- **TodoItem**: 單個待辦項目的顯示與操作（完成、編輯、刪除）
- **TodoForm**: 可重用的表單元件，支援新增和編輯模式

### 資料流

1. 使用者透過 UI 觸發操作 → 元件發出事件
2. 父元件接收事件 → 呼叫 store 的 actions
3. Store 更新狀態 → 觸發元件重新渲染
4. 元件透過 computed 屬性取得最新的過濾/計算資料

## 重要慣例

### TypeScript 類型

所有資料結構都有明確的 TypeScript 定義在 `src/types/todo.ts`：
- 使用 `TodoPriority` enum 定義優先級（low, medium, high）
- `Todo` interface 包含完整的待辦事項結構
- `TodoFormData` interface 用於表單資料傳遞

### 路徑別名

使用 `@` 作為 `src` 目錄的別名（在 `vite.config.ts` 中配置）：
```typescript
import { useTodoStore } from '@/stores/useTodoStore'
import type { Todo } from '@/types/todo'
```

### Element Plus 整合

所有 Element Plus 圖標已在 `main.ts` 中全域註冊，可在任何元件中直接使用：
```vue
<el-icon><Calendar /></el-icon>
```

### 元件通訊模式

- 父子元件透過 props 和 emits 通訊
- 使用 `v-model:visible` 控制對話框顯示
- 表單元件發出 `submit` 和 `update` 事件，由父元件處理實際的資料操作

## 注意事項

- 專案使用 Composition API，避免使用 Options API
- 所有元件使用 `<script setup>` 語法糖
- ID 生成使用時間戳加隨機字串的組合（參考 `useTodoStore.ts:19`）
- 日期格式使用 ISO 8601 格式字串
- 使用者介面文字為繁體中文
