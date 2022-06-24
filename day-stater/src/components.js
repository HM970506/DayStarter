import {useEffect, useState, React} from "react";
import style from "./css/style.css";


const Apis=[['Weather',<Weather/>], ['Subway',<Subway/>],['Todolist',<Todolist/>], ['Youtube', <Youtube/>]];

function Checkboxes(){

    //중괄호 내에는 변수, 함수만 넣을 수 있음!
    return(
        <div className="checkboxes">
            <ul>
            {Apis.map((array)=><Checkbox apiname={array[0]} key={array[0]}/>)   }
            </ul>
        </div>
    )
}

function Checkbox({apiname}){
    const [state, setState]=useState(false);

    const onChange=(e)=>setState((x)=>!x);

    useEffect(()=>{
        const div=document.getElementById(apiname);
        state ? div.className="api apiShow" : div.className="api apiHyde";
        }, [state])

    return (
        <li>
            <label htmlFor={apiname}>{apiname}</label>
            <input type="checkbox" className="apiCheck" onChange={onChange} id={apiname+"Checkbox"}/>
        </li>
    )

}



function Api(){
    
    return(
        <div className="apiList container">
            { Apis.map((array)=><div key={array[0]+"div"} className="item apiShow" id={array[0]} > {array[1]} </div>)}
        </div>
    )
}


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

const Cloth=["민소매, 반바지", "반팔, 얇은 셔츠",
"얇은 가디건, 청바지", "얇은 니트, 맨투맨", "자켓, 스타킹",
"트렌치코트, 니트", "코트, 히트택",
"패딩, 목도리"];

class DayWeather{
    constructor(temp, humidity, weather){
        this.temp=temp;
        this.humidity=humidity;
        this.weather=weather;
    }

    getTemp(){
        return this.temp;
    }

    getHumidity(){
        return this.humidity;
    }

    getWeather(){
        return this.weather;
    }
}

function Weather(){
    //1.오늘 날짜의 평균온도를 가져옴
    //2.어제날짜의 평균온도와 비교하여 어제보다 더운지, 추운지 비교
    //3.해당 온도에 맞는 옷차림 추천
    //4.비가 오면 우산을 가져가는 것을 추천
    const [geo, setGeo]=useState("");
    const [weathers, setWeathers]=useState("");
    const [loading, setLoading] = useState(true);

    
    useEffect(()=>{load()},[]); //load함수는 한번만 실행하여 geo를 변경
    useEffect(()=>{
        if(geo!=""){
            getData().then((res)=>setWeathers(res));
        }
        },[geo]); //geo가 변경되면 해당 geo값으로 data를 가져와 weathers를 변경

    function Weatherdiv(){
        if(weathers=="") {return false;}
        const todayTemp=weathers[0].getTemp();
        const gapTemp=weathers[0].getTemp()-weathers[1].getTemp();
        const clothIndex=whatCloth(todayTemp);
        const todaySky=weathers[0].getWeather();
        const todayHumidity=weathers[0].getHumidity();


        return (
            <div id="weatherframe">
                <div><div className="center"><WeatherIcon value={todaySky}/></div><div className="center"><h3>{todayTemp}℃</h3></div></div>
                <div><h4>추천 복장</h4><div>{Cloth[clothIndex]}</div><Discomport humidity={todayHumidity} tempurture={todayTemp}/></div>
            </div>
        )
    }

    const Discomport=(props)=>{
        const hum=props.humidity;
        const temp=props.tempurture;
        const discomportIndex= 9/5*temp-0.55*(1-hum)*(9/5*temp-26)+32
        console.log(temp, hum,discomportIndex );

        switch(discomportIndex){
            case(discomportIndex<=68 && temp<=20): return (<div>쾌적한 날씨입니다!</div>);
            case(discomportIndex<=70 && temp<=21): return (<div>불쾌지수가 낮습니다.</div>);
            case(discomportIndex<=80 && temp<=26.5): return (<div>불쾌지수는 보통입니다.</div>);
            case(discomportIndex<=83 && temp<=28.5): return (<div>불쾌지수가 높습니다.</div>);
            default: return (<div>불쾌지수가 매우 높습니다!</div>)
        }
    }

    const WeatherIcon=(props)=>{
        switch(String(props.value)[0]){
            case "2": return (<i className="material-icons">thunderstorm</i>)
            case "3":
            case "5": return (<i className="material-icons turn">beach_access</i>)
            case "6": return (<i className="material-icons turn"> ac_unit</i>)
            case "7": return (<i className="material-icons">foggy </i>)
            case "8": return (<i className="material-icons turn">sunny</i>)
            default: return (<i className="material-icons">question_mark</i>)
        }
    }

    
    function whatCloth(tem){
        if(tem>=28) return 0;
        else if(tem>=23) return 1;
        else if(tem>=20) return 2;
        else if(tem>=17) return 3;
        else if(tem>=12) return 4;
        else if(tem>=9) return 5;
        else if(tem>=5) return 6;
        else return 7;
    }


    const getWeather=async(url, now)=>{
        try{
        const data=await (await fetch(url)).json();
        let day=now=="today" ? data : data.list[0];
        const temp= KtoC(day.main.temp_max); 
        const humidity=day.main.humidity;
        const weather=(day.weather)[0].id;
        return new DayWeather(temp, humidity, weather);
        }catch{
            console.error("Failed get Weather Data");
        }
    }

    const onGeoOk=async(position)=> {
        try{
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setGeo([lat, lon]);
        }catch{
            console.error("Failed get Geometric Data");
        }
       
    }
    function onGeoError() {
        return ("Gps is off");
    }

    function KtoC(tem){
        return (parseInt(tem)-273.15).toFixed(0);
    }

    const getData = async()=>{
        try{
        const API_key="630b5303f9175771e71dd96d35fa650c";
        const utc =  Math.floor(new Date().getTime() / 1000);
        //console.log(new Date().getDate(), new Date().getTime());
        const lat=geo[0];
        const lon=geo[1];
        const start=utc-86400;
        const end=start+3600;
        const todayURL= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lan=kr&appid=${API_key}`;
        const yesterURL=`http://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lon}&type=hour&start=${start}&end=${end}&appid=${API_key}`;
        const todayWeather = await getWeather(todayURL, "today");
        const yesterdayWeather =  await getWeather(yesterURL, "yesterday");

        return [todayWeather, yesterdayWeather];
        }        catch{
            console.error("Failed get Tempurture Data");
        }
    }

    const load =async()=> {
       try{
        navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
        setLoading(false);}
        catch{
            console.error("Failed Make WeatherApi");
        }
    }


    return(
        <div>  
            {loading ?  "" : <Weatherdiv/>}
        </div>

    )
}


function Todolist(){
    //엔터키를 치면, 리스트에 해당 input 저장 -> OK
    //추가된 input은 더블클릭시 수정가능
    //체크시 background색이 변한뒤 사라지는 애니메이션 + 리스트에서 내용 수정
    //리스트가 수정될 때마다 웹스토리지값이 변화

    //즉, state는 2개가 필요
    //1.input button을 누를 때마다 list를 변화시키는 state
    //2.list가 변화할 때마다 storage를 변화시키는 state
    //+별도로 checkbox를 누를 때마다 list에서 해당 인덱스를 삭제

    //react에서는 dom을 건드리면 안 됨.
    //input value값 수정시 해당값 고정이므로 각 list마다 value를 가지는 usestate를 만들어주어야 함.


    let storage=window.localStorage.getItem("Todolist");
    const [todos, setTodos]=useState(storage==null ? new Array():storage.split(","));
    const [todo, setTodo]=useState("");

    const Todo=(props)=>{
        const [value, setValue]=useState(props.firstValue);
        const editTodoStart=(e)=>{
            e.target.readOnly=false;
            setValue(e.target.value);
        }
    
        const editTodoEnd=(e)=>{

    
            if (e.key == 'Enter') {
                const editText=e.target.value;
                if(editText==""){
                    setValue(props.firstValue);
                }
                else {
                const editIndex=props.idx;
                const newtodos=(todos.concat([]));

            newtodos[editIndex]=editText;
               setTodos((x)=>newtodos);
                }
                e.target.readOnly=true;
            }
        }

        const onchange=(e)=>{
            setValue(e.target.value);
        }
    
        return(
            <textarea className="todo" type="text" value={value} readOnly={true} onChange={onchange} onDoubleClick={editTodoStart} key={props.idx} onKeyPress={editTodoEnd}/>
        )
    }

    useEffect(
        () => {
            if(todo!=""){
                //불변성 유지: 리액트에서는 set을 통하지 않고 state를 직접 수정해서는 안 됨 -> concat사용
                setTodos((x)=>x.join("/")=="" ?  [todo] : x.concat([todo]));
            }},[todo]);

    useEffect(() => { window.localStorage.setItem("Todolist", todos)}, [todos]); //todo가 수정될 때마다 localstorage가 수정됨

    const EnterKey=(e)=>{
        const text=e.target.value;
        if (e.key == 'Enter' && text!="") {
            setTodo((x)=>x=text);
            e.target.value="";
        }
    }

    const deleteCheckbox=(e)=>{
        const delIndex=parseInt(e.target.value);
        //splice의 return값은 삭제된 부분이므로, 2개의 slice를 concat하여 새 array만들기
        setTimeout(function(){setTodos((x)=>((x.slice(0,delIndex)).concat(x.slice(delIndex+1))))}, 150);

    }

    return (
    <div className="apiframe" id="todolistframe"> 
     <input type="text" onKeyPress={EnterKey} />
    <ul>
        
       {todos.map((x, idx)=>x!="" ? <li className="todos" key={idx}>
             <Todo firstValue={x} idx={idx}/>
         <input type="checkbox" onChange={deleteCheckbox} value={idx} checked={false}/>
    </li>: "")
    }

   </ul>
    
    </div>
    );
}


function Subway(){

    const [data, setData]=useState();
    const [times, setTimes]=useState("");
    const [loading, setLoading] = useState(true);
    const myStationName="노들";

    const API_KEY="6c4e6c7763303530313130664d4b6b57";
    const URL=`http://swopenAPI.seoul.go.kr/api/subway/${API_KEY}/json/realtimeStationArrival/0/10/${myStationName}`
    //1.해당 시간의 값을 가져옴
    //2.1분마다 api를 새로 가져옴
    useEffect(()=>{load()}, []); //loading은 1회만
    useEffect(()=>{
        getData(); 
       // setInterval(()=>getData(), 30000);  실제 배포시에는 이거 풀어야 해~~!!!!!
    },[loading]); //로딩 시작시 1분마다 data가져옴
    useEffect(()=>{if(data!=null){setTimes(getStationLoop(data));}},[data]); //data가 변할 때마다 times update
   // useEffect(()=>{console.log(times);}, [times]); //times가 변할 때마다 콘솔 출력 test

    function getStationLoop(data){
        let arvlMsgList=[];
        for(let y=0; y<data.length; y++){
            if(data[y].updnLine==="상행"){
                arvlMsgList.push(data[y].arvlMsg2.split(" ")[0]);
            }
        }
        return arvlMsgList;
    }

    const load =()=> {setLoading(false); }

    const getData=async()=>{
        try{
        const data=(await (await fetch(URL)).json()).realtimeArrivalList;
        setData(data);
        }        catch{
            console.error("Failed get Subway Data");
        }
    } 

    const Subwaydiv=()=>{
        if(times=="") {return (<></>)};
        return(
            <div>
                <h3>노들역</h3>
                {times.map((x, idx)=><div key={idx}>{`다음 기차까지 남은 시간: ${x}`}</div>)}
            </div>
        )
    }

    return(<>
            {loading ?  "" : <Subwaydiv/>}
    </>);
}

export {Checkboxes, Api}