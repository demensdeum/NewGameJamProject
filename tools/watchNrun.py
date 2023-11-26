import sys
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess

need_reload = False

class FilesChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.is_directory:
            return
        elif event.event_type == 'modified':
            print(f'File {event.src_path} has been modified. Running bat file...')
            run_bat_file()

def run_bat_file():
    global need_reload
    try:
        subprocess.run([bat_file_path])
        need_reload = True
        print(f"reload_needed set to: {need_reload}")
    except Exception as e:
        print(f'Error running bat file: {e}')

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <directory_path> <bat_file_path>")
        sys.exit(1)

    directory_path = sys.argv[1]
    bat_file_path = sys.argv[2]
    
    event_handler = FilesChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, directory_path, recursive=False)

    print(f'Watching directory: {directory_path}')
    print(f'Executing bat file: {bat_file_path}')
    
    observer.start()

import asyncio
import websockets
import time

async def handler(websocket, path):
    # Просто принимаем сообщения и отправляем их обратно клиенту
    async for message in websocket:
        print(f"Received message: {message}")
        await websocket.send(f"Server received: {message}")

async def send_data(websocket, path):
    global need_reload
    while True:
        await asyncio.sleep(2)
        if need_reload:
            await websocket.send("need_reload")
            need_reload = False            
        else:
            await websocket.send(str(time.time()))  

start_server = websockets.serve(handler, "localhost", 8765)
start_data_sender = websockets.serve(send_data, "localhost", 8766)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_until_complete(start_data_sender)
asyncio.get_event_loop().run_forever()