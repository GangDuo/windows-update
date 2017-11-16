@echo off
pushd %~dp0
cscript //nologo .\UninstallAndHide.js < kbs.txt
shutdown /r /t 0
pause