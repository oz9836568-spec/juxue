$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonCommand = Get-Command py -ErrorAction SilentlyContinue

if (-not $pythonCommand) {
  Write-Host "未找到 Python。你也可以直接双击 index.html 使用离线演示。"
  Read-Host "按 Enter 退出"
  exit 1
}

Write-Host "剧学 MVP 正在启动：http://localhost:4173"
Write-Host "关闭此窗口即可停止本地服务。"
& $pythonCommand.Source -m http.server 4173 --directory $projectRoot
