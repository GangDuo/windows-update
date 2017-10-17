@echo off
cscript //nologo .\UninstallAndHide.js < kbs.txt
shutdown /r /t 0
pause