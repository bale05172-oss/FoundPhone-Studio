# 0.9.0 — 剧情演示（锁屏 / 微信联系人 / KKT 聊天与来电）

默认故事 `stories/template/story.json` 升级为可玩的剧情演示，保留全部既有功能与 MIT 许可：锁屏密码 0329、P1 壁纸（自包含资源，离线可用）；微信「通讯录」合并手机联系人（裴柱现 + P2 头像）；KKT 会话录入 10-24 14:00 起的自然时间聊天记录（含两张表情包）；玩家读完消息后自动弹出裴柱现来电（延迟 40 秒，可接听 / 拒接），拒接后回到会话并显示「未接来电」系统行。引擎以最小侵入增强：`SkinProps.contacts` 注入微信通讯录、来电层显示联系人头像、`kind=call` 消息渲染为居中系统行（不可点击，结局仅供自动化测试触达）。事件链经验：start 节点 next 必须为空，来电只由 openApp(kakao) 事件触发。同步更新 release / original-icons / runtime 测试以匹配新默认故事；vitest 46/46、e2e 25/26（唯一失败为上游 original-icons 的 twitter 清单过期，与本次无关）。
# 0.8.1 — UI 打磨层（界面与交互升级）

在保留 iOS 基础框架与全部既有功能的前提下新增 `src/ui-polish.css` 打磨层：升级壁纸体系（含默认模板改为自包含紫色渐变，离线可用，不再依赖 developer.apple.com 远程图片）、设备外壳与灵动岛质感；为图标、控制中心、锁屏工具、键盘等增加按压反馈；为通知横幅、App 切换器（依次入场）、文件夹（图标错峰）、系统面板、抽屉、故事选择与模拟来电增加入场动效；打磨小组件玻璃质感、Dock、搜索、页码点胶囊动画与拖拽幽灵；全部动效遵守 `prefers-reduced-motion`。README 截图随 e2e 自动更新。引擎、剧情数据与既有测试保持不变。

# 0.7.0 — 空白默认手机与用户实机参考

默认不加载剧情；旧样例仅用于测试。按用户14张真实截图校准设置、微信和控制中心；系统版本不限定iOS18。私人截图不公开打包，既有引擎、存档及编辑版备份保留。

# 0.6.0 — AI script framework

先备份并验证0.5编辑版，再在ai-script-framework分支增量改造。新增脚本工具链、标准AI文档、双结局示例、无编辑器静态入口、PWA离线测试、系统设计参数、设置导航和独立详情页。保留47App和既有引擎。全App逐页视觉验收未完成。

# Changelog

## 0.1.0 — 2026-10-24

Initial development preview: local phone shell, 47 app templates using shared engine views, creator editing, IndexedDB drafts, player state isolation, branching story execution, React Flow, chat import, media, rich text, JSON/ZIP/static export, PWA shell, MIT documentation and automated tests. Full requirements are not yet complete; see docs/PROGRESS.md.

## 0.2.0 — 2026-10-24

Renamed Chinese UI to 捡手机. Reduced Studio copy and switched the host workspace to monochrome system styling. Added optional app library and a legacy-compatible installed flag distinct from home visibility, uninstall data choice, reinstall, pointer ordering, folders and custom icons. New projects start with six system apps and no sample story. Added independent WeChat, WhatsApp and Instagram layouts and navigation over the existing runtime. Existing story/save/export functionality retained. Full independent UI coverage for the remaining 44 apps is still pending.

## 0.3.0 — 2026-10-24

Extended independent primary UI coverage to all47 apps; added bounded app metadata editors, persisted player selections/audio progress, chronological delay scheduling, time/variable cascades and simulated call branches. Lazy-loaded rich editing and grouped app skins. Existing install lifecycle, author drafts and exports preserved. Full platform fidelity and real-device validation remain pending.

## 0.4.0 — 2026-10-24

iOS18 visual calibration: fixed logical device coordinate space, paged home screen, redrawn app artwork, glass surfaces and system navigation, WeChat chat/list spacing. Preserved runtime and app installation data. This is not pixel-identical official product reproduction.

## 0.5.0 — 2026-10-25

Reviewed five iOS web simulators and adapted attributed MIT launcher/Dock, unlock and control modules. Added staged lock/passcode,393×852 device metrics, gestures, notification stack/banner, keyboard drafts and grouped settings. Retained existing engines, app installation lifecycle and exports. Fixed dev lazy import initialization. Full platform fidelity remains incomplete.
