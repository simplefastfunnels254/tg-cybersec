@echo off
cd /d "%~dp0"
python md-to-json.py
echo.
echo Press any key to exit...
pause > nul 