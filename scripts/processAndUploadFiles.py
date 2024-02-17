import os
import glob
import requests
import dotenv

dotenv.load_dotenv()
dir_path = os.path.normpath( os.path.join(os.path.dirname(__file__), '../') )

# API URL
url = 'https://api.schickl.app/oeh.schickl.app/overwrite'
header = { 'Authorization': os.getenv('AUTHORIZATION_TOKEN') }

# GET-Anfrage an die API senden
print(f'Read overwrite directory')
response = requests.get( url, headers = header )
if response.status_code == 200:
  print(f'- Success: {response.json()}')
else:
  print(f'- Error: {response.text}')

# DELETE-Anfrage an die API senden
#response = requests.delete( url, headers = header )

for file_path in glob.glob(os.path.join(dir_path, '[a-z][a-z].*')):
  with open(file_path, 'r', encoding='utf-8') as file:
    data = {
      'filename': os.path.basename(file_path),
      'content': file.read()
    }
      
    print(f'Sending file {file_path}');
    response = requests.put( url, json = data, headers = header )
     
    if response.status_code == 200:
      print(f'- Success: {response.json()}')
    else:
      print(f'- Error: {response.text}')

