import {useEffect, useState, React} from "react";

function Youtube(){
    //1.특정 공개된 플레이리스트를 가져옴
    //2.정지된 상태로 가져와 플레이리스트를 자동연속재생하도록 설정
    //3.창 크기에 따라 영상 비율 resizing
    const API_KEY="AIzaSyCHZR3vYLQs69URyNPotBeWeeyrSafT4yk";
    const PlaylistId="PL436qxW-X8dcmeQQVOVwDyIufW5_Ksgrm";
    const url=`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${PlaylistId}&maxResults=1&key=${API_KEY}`

    const [loading, setLoading]=useState(true);
    const [playlist, setPlaylist]=useState(null);

    useEffect(()=>{getData()}, []);
    useEffect(()=>{Playlistdiv()},[playlist]);

    const getData=async()=>{
        try{const data=await(await fetch(url)).json();
        setPlaylist(data.items[0]);
        setLoading(false);}
        catch{
            console.error("Failed get Youtube Data");
        }
    }

    const Playlistdiv=()=>{
        if(playlist!=null){
            return( 
            <div className="apiframe">
                <div className="playlist">
                <h3>{playlist.snippet.localized.title}</h3>
                <div className="video-wrap">
                <iframe id="ytplayer" type="text/html" width="720" height="405"
                src="https://www.youtube.com/embed/?listType=playlist&list=PL436qxW-X8dcmeQQVOVwDyIufW5_Ksgrm"
                frameBorder="0"/>
                </div>
                </div>
            </div>
            )
        }
        return(<></>)
    }

    return(
        <>
            {loading ? "" :<Playlistdiv />}
        </>
    )

      
}

export default Youtube;