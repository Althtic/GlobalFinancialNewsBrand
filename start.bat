@echo off
chcp 65001 >nul
title 金融新闻热点看板
cd /d "%~dp0"

echo ================================================
echo   金融新闻热点看板 - 启动中
echo ================================================
echo.
echo 正在启动开发服务器...
echo.
echo ================================================
echo   启动完成！
echo   前端: http://localhost:3000
echo   API:  http://localhost:3001
echo ================================================
echo.

"C:\Program Files\nodejs\npm.cmd" run dev

pause