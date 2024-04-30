import requests

def play_pause():
    url = 'http://localhost:3000/api/spotify'
    myobj = {'type': 'play_pause'}

    x = requests.post(url, json = myobj)

    print(x.text)

def change_song():
    url = 'http://localhost:3000/api/spotify'
    myobj = {'type': 'change', 'song_id': '6ie2Bw3xLj2JcGowOlcMhb'}

    x = requests.post(url, json = myobj)

    print(x.text)

# change_song()
play_pause()