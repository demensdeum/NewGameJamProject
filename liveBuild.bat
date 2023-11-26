set PATH=%PATH%;.\node_modules\.bin;"C:\Program Files\Mozilla Firefox\"
:loop
cls
python tools/preprocessor/preprocessor src src-preprocessed
call tsc
timeout /t 4
goto loop
