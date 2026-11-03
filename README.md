# 方块之间：GitHub Actions 安卓打包

状态：已准备构建工程并完成本地静态检查；尚未在 GitHub 执行构建，没有生成 APK。

## 工程来源

现有游戏是 HTML/CSS/JavaScript Web 应用，不是 Flutter 或 React Native。
www/index.html、style.css、game.js 从已完成的游戏原样复制，SHA-256 记录在 source-hashes.json。
保留计分、等级、旋转、消行、暂存、落点预览、暂停、重新开始、手机触控、本机最高分。
原来的 blocks-android 是手写 WebView 外壳；此工程使用 Capacitor 7 封装，不依赖该旧外壳。

## 目录

- www/：原有游戏代码，所有资源随 APK 离线打包
- package.json：固定 Capacitor core/android/cli 7.0.0
- capacitor.config.json：应用 ID、名称、资源目录
- scripts/prepare-android.mjs：调用官方 CLI 创建完整 android/ 目录，设置构建版本并检查必要文件
- scripts/check.cjs：游戏源文件哈希校验和核心逻辑测试
- .github/workflows/build-apk.yml：手动或推送触发的 APK 编译流程
- source-hashes.json：原始游戏校验值

android/ 由固定版本的 Capacitor CLI 在 Actions 中生成，包含 Manifest、Activity、资源、Gradle Wrapper/JAR 和构建脚本；不需要在当前云端安装 SDK。

## 版本配置

Node 22；Capacitor 7.0.0；Java 21；AGP 8.7.2；Gradle 8.11.1；compile/target SDK 35；Build Tools 34.0.0；min SDK 23（Android 6.0）。
Java 21 对应 Capacitor 7，Gradle 8.11.1 支持 Java 21 并满足 AGP 8.7 的 Gradle 要求。
AGP 8.7 支持 API 35，默认 Build Tools 34.0.0。
目标 Android 15 的边到边布局通过主题设置暂时退出，以保留现有游戏布局。

## 下一步：GitHub 操作

1. 在 https://github.com/new 新建专用仓库，例如 blocks-android，建议 Private，并勾选 Add a README file。
2. 授权 ChatGPT 的 GitHub 连接访问这个仓库，然后把仓库链接发给助手，由助手继续提交文件。
3. 如果自行上传，请解压工程，将工程目录内的所有文件上传到仓库根目录（不是上传 ZIP），务必包含隐藏目录 .github。
4. 提交至 main 后会自动触发构建。也可打开 Actions → Build Android APK → Run workflow。
5. 等该次构建变绿，打开该运行页面底部 Artifacts → blocks-debug-apk，下载并解压。
6. 将 blocks-debug.apk 传到安卓手机，点击安装；系统提示时允许当前下载工具或文件管理器安装应用。

不要下载 android-build-inputs 作为安装包：它用于查看解析后的依赖和原生工程。

## 失败排查

打开失败的运行 → build → 展开红色步骤，读取日志。Gradle 使用 --stacktrace 输出错误。
可下载 android-build-inputs 检查原生工程和 package-lock.json。
把失败运行的链接发给助手后，可依据真实日志修复。

## 已知验证边界

本地通过游戏逻辑检查、源文件一致性检查、构建脚本语法检查。
未在此环境安装 npm 依赖，未生成原生 android/，未编译 APK，未做安卓真机验证。
直接 Capacitor 版本固定；首次 Actions 使用 npm install 解析传递依赖，并保存 package-lock.json。
首个成功构建后建议将该 lock 文件提交，改用 npm ci 以固定完整依赖树。
Debug APK 由 Gradle 自动签名，可个人安装，不是应用商店发布包。
不同运行的临时 Debug 签名可能不同；遇到更新签名冲突，需卸载旧版再安装（会清除本机最高分）。
