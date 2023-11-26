cls
set PATH=%PATH%;.\node_modules\.bin;
python .\tools\preprocessor\preprocessor.py .\src .\src-preprocessed .\tools\preprocessor\rules.json

@echo off
if %errorlevel% neq 0 (
    @echo on
    echo An error occurred! Exit code: %errorlevel%
    @echo off
    exit /b %errorlevel%
)

call tsc
