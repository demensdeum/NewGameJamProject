cls
set PATH=%PATH%;.\node_modules\.bin;"C:\Program Files\Mozilla Firefox\"
call tsc

@echo off
if %ERRORLEVEL% neq 0 (
    @echo on
    echo FIX CODE FIRST DUDE!!!!!!
    @echo off
    exit %ERRORLEVEL%
)

start python tools/server.py
timeout /t 1
firefox http://localhost:8000
@pause