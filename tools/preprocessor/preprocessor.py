import os
import sys
import json

def load_rules(file_path):
    with open(file_path, 'r') as rules_file:
        return json.load(rules_file)

def process_file(input_file, output_file, rules):
    with open(input_file, 'r') as file:
        content = file.read()
        for key, value in rules.items():
            content = content.replace(key, value)

    with open(output_file, 'w') as file:
        file.write(content)

def process_files_in_folder(input_folder, output_folder, rules):
    for filename in os.listdir(input_folder):
        if filename.endswith(".ts"):
            input_file = os.path.join(input_folder, filename)
            output_file = os.path.join(output_folder, filename)
            process_file(input_file, output_file, rules)
            print(f"Файл {filename} обработан и сохранен в {output_folder}.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Использование: python script.py /путь/к/исходной/папке /путь/к/выходной/папке")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_folder = sys.argv[2]

    if not os.path.exists(input_folder):
        print(f"Указанная папка {input_folder} не существует.")
        sys.exit(1)

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    rules_file_path = 'rules.json'  # Путь к файлу с правилами
    rules = load_rules(rules_file_path)

    process_files_in_folder(input_folder, output_folder, rules)
