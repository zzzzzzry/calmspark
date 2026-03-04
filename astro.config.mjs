import { defineConfig } from 'astro/config';

// 纯静态模式配置（适配GitHub Pages）
export default defineConfig({
  // 必须：设置为纯静态输出，禁用SSR
  output: 'static',
  // 必须：配置base路径（和你的仓库名calmspark一致）
  base: '/calmspark',
  // 可选：保留你原来的其他配置（比如集成、插件），示例如下：
  // integrations: [vue(), react()] // 如果有这些，保留即可
});