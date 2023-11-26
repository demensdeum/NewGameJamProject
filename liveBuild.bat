set PATH=%PATH%;.\node_modules\.bin;"C:\Program Files\Mozilla Firefox\"
:loop
cls
python .\tools\preprocessor\preprocessor.py .\src .\src-preprocessed .\tools\preprocessor\rules.json
call tsc
timeout /t 4
goto loop
