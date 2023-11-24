set PATH=%PATH%;.\node_modules\.bin;"C:\Program Files\Mozilla Firefox\"
call tsc
start python -m http.server
timeout /t 1
firefox http://localhost:8000
@pause