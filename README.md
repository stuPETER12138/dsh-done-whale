# dsh-done-whale 🐋

让 DeepSeek Harness 的**标签页鲸鱼图标变成状态灯**。保留原版鲸鱼轮廓，无轮询、无额外网络请求。

| 颜色 | 含义 | 恢复条件 |
|---|---|---|
| 🟢 绿色 | 主会话已完成、尚未查看 | 打开对应会话 |
| 🟠 琥珀色 | 主会话有待处理交互，例如提问、审批或计划审核 | 处理交互后 |
| ⚫ 默认 | 没有未读完成或待处理交互 | 使用原图标，或自定义默认色 |

绿色优先于琥珀色；子代理不会触发变色。完成信号使用官方 `sessions.list`，待处理信号使用 `uiSession.pendingInteractions`，与新版侧栏同源。另补齐“当前选中的会话在隐藏标签页中完成”的提醒：回到该会话时清除，不会误清其他未查看会话。

## 安装（GitHub）

需要 Node.js 22+、Git，以及新版 DeepSeek Harness Web profile。此版本按 CLI **0.1.5-rc.1**、设置包 **0.1.5-rc.2** 的已安装接口适配；不兼容旧 `0.1.1` 客户端架构，不保证未来版本接口不变。

```sh
dsh plugin --profile web add "github:stuPETER12138/dsh-done-whale"
```

`web` 是 profile 名称，使用其他名称时请替换。**安装后重启该 profile 的 Harness，再刷新浏览器页面**；仅刷新不足以加载新增 Host 插件。

- GitHub 仓库提交了 `lib/` 构建产物，安装时无需 TypeScript、构建工具或 `prepare` 脚本。
- 可在 GitHub spec 后追加 `#<commit或tag>` 固定已发布版本；安装远端内容前请核对来源。
- 上述命令使用仓库默认分支，只有本次修改推送到 GitHub 后才会安装到这版代码。
- CLI 将包参数交给 profile 的 pnpm 安装。若 pnpm 提示构建审批，请检查具体依赖，勿全局放开构建权限。

卸载：

```sh
dsh plugin --profile web remove dsh-done-whale
```

随后重启 Harness 并刷新页面。插件释放时会撤销订阅并还原图标；已保存的颜色配置可能仍保留在官方设置中，卸载不会主动删除用户配置。

## 自定义颜色

打开设置 → **鲸鱼状态灯**，可分别调整完成色、待处理色、默认色。支持中英文界面。

- 颜色选择器即时保存；文本框使用 `#RRGGBB`，失焦或按 Enter 保存。
- 非法值不提交，保存失败显示提示；设置只读或不可用时禁用输入。
- 每行可单独恢复默认：完成 `#22C55E`，待处理 `#F59E0B`，默认色恢复原图标。
- 设置由 Harness 官方 settings 服务持久化，无自建存储。

完成提醒是浏览器内存状态，刷新后会清除；待处理状态随官方交互源重新同步。

## 开发

```sh
npm ci --legacy-peer-deps
npm run check
npm pack --dry-run
```

开发与测试不需要安装整套 Harness：peer 依赖由实际运行的 profile 提供，开发安装用 `--legacy-peer-deps` 跳过它们。测试使用 Node 内置 test runner 和 React 测试渲染器，不启动服务器、不修改本机 Harness 配置。

```text
src/
  index.mjs       Host：注册颜色 schema
  client.mjs      Client：订阅、favicon 与 Slot 生命周期
  status.mjs      纯状态机：官方提醒 + 隐藏标签页完成补齐
  settings.mjs    设置 UI 与中英文文案
  shared.mjs      颜色常量及校验
  favicon.mjs     原版鲸鱼 SVG
scripts/build.mjs  esbuild 双端构建
lib/               提交到 Git，供安装直接加载
test/              状态、设置、打包与客户端回归测试
```

修改源码后运行 `npm run check`，并一起提交 `src/` 与更新后的 `lib/`。CI 会检查构建产物是否同步。Host 注册位于 bundle 的 `cordis.patch.yml`，不属于 agent preset；客户端仍使用官方 ModuleLoader CJS 协议，不打包 React 或 Harness 服务。

目前自动化验证包含构建、12 项单元/组件/加载协议测试和打包检查；这些不等于真实浏览器端到端验证。发布前建议在目标 profile 检查：后台完成变绿、审批变琥珀、查看后恢复、颜色保存及重启后保留。

## License

MIT
