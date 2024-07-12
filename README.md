# Yt Music API

## Motivation
I just was bored and wanted to use the Spotify API to search for songs on Youtube. You can use the official Youtube API but due to quota limmitation I chose to
use a unofficial Youtube Music API.
If you want to look into the code for how to use the Official Youtube API then check the commented code.

## Features
This is a website where you provide a spotify playlist id and it uses the ytmusic-api package from npm to search the corresponding youtube video.
Utilizes the Spotify API which requires an authorization from the client to utilize this app. 
Fetches the songs in the playlist and picks a random song to play. 

## Next Tasks
SongQuiz App?
Download Option For YT Videos?

## Concerns/Questions?
Q: It played the wrong song! 

A: I'm really sorry but I can't account for the error that yt-music-api package has as it's not entirely super accurate. I tried to fix it by doing better search queries but some discrepancies just seem 
   get bypassed

Q: Why is my window reloading so much?

A: It's the spotify api. It seems everytime the refresh token is expired i need to clear the cache but that requires a refresh to enable my changes.

Q: Are you going to continue working on this project?

A: Most likely not unless I'm super motivated.

## How To Clone
1. First Create A Spotify App.
2. Fill In the .env variable for Vite Spotify Client ID
3. Go to src/auth/auth.ts and change all instances of redirect_uri to http://localhost:5173/callback
4. Change the fetch link in YoutubeAPI.ts to http://localhost:5173/api/ytmusic?q=${query}
5. Do npm run dev
6. Next for the backend you need to uncomment all the code for server.ts and run a seperate terminal with ts-node server.ts
7. Viola you have successfully ran the application.

***




## # [Home | Spotify for Developers](https://developer.spotify.com/)


### 1. Click on Profile
![Step 1 screenshot](https://images.tango.us/workflows/7326e24e-95ff-4444-942f-b06c4d6826c3/steps/9cd2970b-9790-4179-a081-77fe83ecc66a/8e61ea52-5755-4b57-84d9-3218fa720fc3.png?crop=focalpoint&fit=crop&fp-x=0.9240&fp-y=0.0436&fp-z=2.7921&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=785&mark-y=31&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zMjImaD0xMjMmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D)


### 2. Click on Dashboard
![Step 2 screenshot](https://images.tango.us/workflows/7326e24e-95ff-4444-942f-b06c4d6826c3/steps/e57fe3ce-3714-4f8c-86bb-2325e0c9f260/2c272ae0-789d-49e0-b8e4-b3a3a5a91eec.png?crop=focalpoint&fit=crop&fp-x=0.9238&fp-y=0.1159&fp-z=2.7984&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=734&mark-y=184&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz00MjAmaD0xMjEmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D)


### 3. Click on Create app
![Step 3 screenshot](https://images.tango.us/workflows/7326e24e-95ff-4444-942f-b06c4d6826c3/steps/93449a9e-c5fd-4278-90bc-a19c5aa19a2c/22668e7b-f42e-4807-9428-04c7a3ba3517.png?crop=focalpoint&fit=crop&fp-x=0.9136&fp-y=0.2254&fp-z=2.7185&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=728&mark-y=308&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zODEmaD0xMzkmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D)

### 5.Type in http://localhost:5173/callback and Check Web API
![Step 11 screenshot](https://images.tango.us/workflows/7326e24e-95ff-4444-942f-b06c4d6826c3/steps/a3b57707-49e0-4868-8052-85213d0b200f/276f326f-5d18-4f58-8054-3c20475b444e.png?crop=focalpoint&fit=crop&fp-x=0.0709&fp-y=0.5545&fp-z=2.5847&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=85&mark-y=345&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0yNzAmaD02NSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw)


### 6. Click on Save
![Step 13 screenshot](https://images.tango.us/workflows/7326e24e-95ff-4444-942f-b06c4d6826c3/steps/18703825-eba6-4658-beb7-b83e7bff2ebc/0524f772-5391-4a01-a87d-64f641ae2914.png?crop=focalpoint&fit=crop&fp-x=0.0564&fp-y=0.8966&fp-z=2.6156&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=48&mark-y=484&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0yNTgmaD0xMzQmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D)


### 7. Click on Settings
![Step 14 screenshot](https://images.tango.us/workflows/7326e24e-95ff-4444-942f-b06c4d6826c3/steps/092c758e-8875-481a-9c38-93ee99d44132/45225f69-9204-4f37-b1ae-f5fe379d8327.png?crop=focalpoint&fit=crop&fp-x=0.9212&fp-y=0.1591&fp-z=2.6487&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=783&mark-y=241&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz0zMzMmaD0xNTUmZml0PWNyb3AmY29ybmVyLXJhZGl1cz0xMA%3D%3D)


### 8. Copy The Client Id
![Step 15 screenshot](https://images.tango.us/workflows/7326e24e-95ff-4444-942f-b06c4d6826c3/steps/03f2df14-b250-4a32-81cf-d16defb81e9c/4a8992ad-50eb-470c-ab76-f8baf045a32b.png?crop=focalpoint&fit=crop&fp-x=0.2363&fp-y=0.4350&fp-z=1.4340&w=1200&border=2%2CF4F2F7&border-radius=8%2C8%2C8%2C8&border-radius-inner=8%2C8%2C8%2C8&blend-align=bottom&blend-mode=normal&blend-x=0&blend-w=1200&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmstdjIucG5n&mark-x=65&mark-y=342&m64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL2JsYW5rLnBuZz9tYXNrPWNvcm5lcnMmYm9yZGVyPTYlMkNGRjc0NDImdz02ODQmaD03MSZmaXQ9Y3JvcCZjb3JuZXItcmFkaXVzPTEw)

***
Created with [Tango.us](https://tango.us?utm_source=markdown&utm_medium=markdown&utm_campaign=workflow%20export%20links)
