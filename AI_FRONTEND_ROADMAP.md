# 高级 AI 前端工程师实战路线图 (Based on Your JD)

这份路线图旨在利用你现有的 `calmspark` (Astro + React) 项目，通过实战项目覆盖 JD 中的所有核心要求。

## 核心能力矩阵 (JD Mapping)

| JD 要求 | 对应技术栈 | 实战项目目标 |
| :--- | :--- | :--- |
| **LLM API & 消息流处理** | `fetch` streams, `TextDecoder`, Vercel AI SDK | 实现一个打字机效果的对话框 |
| **工具调用 (Tool Calling)** | JSON Schema, OpenAI Function Calling | 让 AI 能读取你的简历 JSON 数据 |
| **AI 智能体 (Agent)** | ReAct Pattern, Loop Logic | 创建一个能自主决定"看博客"还是"看简历"的 Agent |
| **RAG (检索增强)** | Vector DB (Voy/Pinecone), Embeddings | "与我的博客对话"功能 |
| **AI UI 交互设计** | Generative UI, React Server Components | AI 输出不是文字，而是动态渲染组件 |

---

## 阶段一：连接与流 (The Socket)
**目标**：掌握大模型最底层的“心跳”——流式传输 (SSE)。拒绝傻等的 Loading 转圈。

### 学习重点
1.  **原生 Fetch Stream**：不依赖库，手写 `ReadableStream` 解析。
2.  **SSE (Server-Sent Events)**：理解 `data: [DONE]` 协议。
3.  **Markdown 渲染**：处理流式输出时的 Markdown 解析闪烁问题。

### 🛠️ 实战任务：为网站添加 `/chat` 页面
1.  申请一个 DeepSeek 或 OpenAI Key。
2.  在 Astro 创建一个 API 端点 `src/pages/api/chat.ts` 处理请求转发（隐藏 Key）。
3.  前端用 React 实现一个输入框 + 消息列表。
4.  **关键点**：实现“打字机”效果，字是一个个蹦出来的，而不是一坨显示。

---

## 阶段二：工具与手 (The Hand)
**目标**：让 LLM 走出聊天框，具备操作能力。这是“聊天机器人”进化为“智能体”的分水岭。

### 学习重点
1.  **Function Calling 协议**：如何定义 JSON Schema 告诉 AI 你有哪些能力。
2.  **双向交互流**：User -> LLM (Call Tool) -> App (Execute) -> LLM (Final Answer)。
3.  **客户端工具**：在浏览器端执行工具（如：切换深色模式、跳转页面）。

### 🛠️ 实战任务：实现 "简历助手"
1.  定义工具 `get_experience` 和 `get_tech_stack`。
2.  当用户问“你以前在哪里工作？”时，AI 不会瞎编，而是触发 `get_experience`。
3.  前端拦截这个 Call，返回 `src/pages/resume.astro` 里的真实数据。
4.  AI 根据数据生成回答。

---

## 阶段三：大脑与记忆 (The Brain & RAG)
**目标**：解决 LLM 的幻觉和上下文限制。

### 学习重点
1.  **Embeddings (嵌入)**：把文字变成向量 (Vectors)。
2.  **Vector Search**：计算余弦相似度 (Cosine Similarity)。
3.  **Client-side RAG**：对于个人博客，不需要庞大的向量库，使用 WASM 向量库 (如 `voy` 或 `oom`) 直接在浏览器跑 RAG。

### 🛠️ 实战任务："博客知识库"
1.  构建脚本：把 `src/pages/blog/*.md` 预处理成向量索引 `index.json`。
2.  用户提问时，先在本地搜索最相关的 3 篇博客片段。
3.  将片段作为 `System Prompt` 注入："基于以下博客内容回答..."。

---

## 阶段四：AI 原生 UI (Generative UI)
**目标**：这是目前最前沿的领域（Vercel, Claude Artifacts 都在做）。AI 不再只是吐字，而是吐“界面”。

### 学习重点
1.  **Vercel AI SDK (RSC)**：流式传输 React 组件。
2.  **结构化输出**：强制 LLM 输出 JSON 用于渲染 UI。
3.  **乐观更新**：预测 AI 的意图并提前渲染 UI 骨架。

### 🛠️ 实战任务：动态组件渲染
1.  用户问：“给我看看你的技能栈”。
2.  AI **不是**列出文字列表。
3.  AI 返回一个指令，前端直接在聊天流中渲染出 `<TechStack />` 组件（就是你首页那个很炫的组件）。

---

## 推荐学习资源

1.  **Vercel AI SDK 文档** (必读，行业标准)
2.  **LangChain.js** (了解概念，但前端建议轻量化)
3.  **DeepLearning.AI** (吴恩达的免费短课程，补理论)
4.  **Astro DB / Vector** (关注 Astro 生态的 AI 集成)
