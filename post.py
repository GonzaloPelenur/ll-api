import requests

url = 'http://localhost:3000/api/spotify'
myobj = {'type': 'play_pause'}

x = requests.post(url, json = myobj)

print(x.text)