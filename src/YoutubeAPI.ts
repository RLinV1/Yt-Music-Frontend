// Uses official Youtube API 
// export async function getYtVideos(query: string): Promise<any> {
//     return await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&order=relevance&q=${query}&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`)
//     .then(data => data.json())
//     .then(list => list.items)
// }
// uses https://www.npmjs.com/package/ytmusic-api
// switch to http:localhost:8080 if running locally on server.ts
export async function getYtVideos(query: string){
    return await fetch(`https://yt-music-api-9ivk.onrender.com/api/ytmusic?q=${query}`).
    then(data => data.json());
      
}
