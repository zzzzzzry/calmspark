# CalmSpark 项目开发指南 (Vue 开发者视角)

你好！既然你熟悉 Vue 并了解 React，这个文档将帮助你快速理解当前项目的架构。

这个项目使用的是 **Astro** 框架，配合 **React** 和 **Tailwind CSS**。

## 1. 核心概念：Astro vs Vue/React SPA

传统的 Vue/React 项目（SPA）会把整个应用打包成巨大的 JavaScript，在浏览器端渲染。
**Astro 的核心理念是 "Islands Architecture"（群岛架构）**：
- **默认静态**：`.astro` 页面在服务器端渲染成纯 HTML。默认情况下，**不发送任何 JavaScript 到浏览器**。
- **按需交互**：只有当你明确指定某个组件需要交互时（例如轮播图、移动端菜单），它才会加载 React 代码并“水合”（Hydrate）。

### 对比 Vue
| 概念 | Vue (SPA) | Astro (MPA + Islands) |
| :--- | :--- | :--- |
| **组件文件** | `.vue` (Template + Script + Style) | `.astro` (Frontmatter + JSX-like Template + Style) |
| **渲染位置** | 主要是浏览器端 (CSR) | 主要是服务器端 (SSR/SSG) |
| **状态管理** | Pinia / Vuex | Nano Stores (因为组件可能在不同"岛屿"上) |
| **路由** | Vue Router (配置式) | 文件系统路由 (`src/pages`) |

---

## 2. 目录结构说明

```bash
src/
├── components/    # UI 组件
│   ├── Header.astro      # 静态组件 (写成 .astro)
│   └── LandingHero.tsx   # 交互组件 (写成 React)
├── layouts/       # 布局模板 (类似 Vue 的 App.vue 或 Layout)
│   └── BaseLayout.astro
├── pages/         # 路由页面
│   ├── index.astro       # -> /
│   ├── about.astro       # -> /about
│   └── blog/
│       └── [slug].astro  # 动态路由 -> /blog/hello-world
└── content/       # 内容集合 (Markdown 文件)
```

---

## 3. 深入代码：如何看懂 `.astro` 文件？

`.astro` 文件结构非常像 `.vue`，但逻辑是**服务端**运行的。

### 示例：`src/pages/resume.astro`

```astro
---
// 1. Frontmatter (组件脚本区)
// 这里的代码只在【构建时/服务端】运行！
// 类似于 Vue 的 <script setup>，但此时没有 window/document 对象。

import BaseLayout from '../layouts/BaseLayout.astro';
import TechStack from '../components/TechStack.tsx'; // 引入 React 组件

const pageTitle = "我的简历";
const skills = ['Vue', 'React', 'Astro'];

// 数据获取直接写在这里，支持 await
const response = await fetch('https://api.example.com/data');
---

<!-- 2. 模板区 (Template) -->
<!-- 语法类似 JSX，但更接近 HTML。可以使用上面定义的变量。 -->

<BaseLayout title={pageTitle}>
  <h1>{pageTitle}</h1>

  <!-- 静态渲染：这部分会变成纯 HTML，没有任何 JS -->
  <ul>
    {skills.map(skill => (
      <li>{skill}</li>
    ))}
  </ul>

  <!-- 交互组件：注意 client:load 指令 -->
  <!-- 只有加了 client:* 指令，React 代码才会被发送到浏览器 -->
  <TechStack client:load initialSkills={skills} />
</BaseLayout>

<style>
  /* 3. 样式区 */
  /* 默认是局部作用域 (Scoped)，就像 Vue 的 <style scoped> */
  h1 { color: red; }
</style>
```

### 关键点：
1.  **`client:load` / `client:only`**：这是 Astro 最重要的指令。
    *   如果你引入一个 React 组件 `<LandingHero />` 但**不加**指令，它会渲染成静态 HTML，`onClick` 等事件**不会生效**。
    *   加上 `client:load`，它才会在页面加载时“活”过来。
2.  **Props 传递**：像 Vue 的 props 一样，`title={pageTitle}` 把数据传给组件。

---

## 4. React 组件 (`.tsx`) 的写法

本项目中，复杂的交互（如首页的文字动画、轮播图）使用 React + Framer Motion 实现。

如果你习惯 Vue：
*   Vue `v-if` -> React `{ condition && <div /> }`
*   Vue `v-for` -> React `{ items.map(item => <div key={item.id} />) }`
*   Vue `class` -> React `className`
*   Vue `style scoped` -> 本项目使用 **Tailwind CSS** (`className="p-4 bg-blue-500"`)

**示例：`src/components/LandingHero.tsx`**
```tsx
import { motion } from 'framer-motion'; // 强大的动画库

export default function LandingHero() {
  return (
    // className 替代 class
    <div className="relative h-screen flex items-center">
      {/* Framer Motion 动画组件 */}
      <motion.h1 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        你好，世界
      </motion.h1>
    </div>
  );
}
```

---

## 5. 样式与动画

本项目主要使用 **Tailwind CSS**。这在 React/Astro 生态中非常流行。
*   不需要写 `.css` 文件，直接在 HTML 标签上写类名。
*   例如：`flex items-center justify-center` 等同于 Flex 居中布局。

全局样式位于 `src/styles/global.css`，主要处理字体和背景重置。

---

## 6. 路由与页面切换 (View Transitions)

Astro 5.0 内置了 **View Transitions**（视图过渡）。
在 `src/layouts/BaseLayout.astro` 中，你可能会看到 `<ViewTransitions />` 组件。
这使得多页应用（MPA）拥有像单页应用（SPA）一样丝滑的无刷新跳转体验。

**注意坑点**：
因为页面没有真正刷新，如果你在 `.astro` 文件中写了 `<script>` 标签（处理 DOM 事件），需要监听 `astro:page-load` 事件，否则跳转回来时脚本可能失效（刚才我们修复的首页箭头问题就是这个原因）。

```javascript
document.addEventListener('astro:page-load', () => {
  // 你的 DOM 操作代码
  console.log('页面加载完成');
});
```

## 总结

*   **页面结构**：用 `.astro` 文件写 HTML 结构和静态内容。
*   **复杂交互**：用 React (`.tsx`) 组件，并通过 `client:load` 引入到 Astro 页面中。
*   **样式**：使用 Tailwind CSS。
*   **逻辑**：服务端逻辑写在 Astro Frontmatter (`---`) 中，客户端逻辑写在 `<script>` 或 React 组件中。

希望这份指南能帮你快速上手！如有具体代码看不懂，随时问我。
