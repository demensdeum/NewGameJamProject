call .\tools\build.bat
@echo off
if %errorlevel% neq 0 (
    @echo on
    echo BUILD IS BROKEN! Exit code: %errorlevel%
    @echo off
    exit /b %errorlevel%
)
python tools\watchNrun.py .\src .\tools\build.bat