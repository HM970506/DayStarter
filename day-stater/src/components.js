import {useEffect, useState, memo, React} from "react";
import ReactDOM from "react-dom";
import style from "./css/style.css";

//async사용한 부분 try catch추가하기
const Apis=[['Youtube', <Youtube/>], ['Weather',<Weather/>], ['Todolist',<Todolist/>], ['Subway',<Subway/>]];

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
        <div className="apiList">
            { Apis.map((array)=><div key={array[0]+"div"} className="api apiShow" id={array[0]} > {array[1]} </div>)}
        </div>
    )
}


function Youtube(){
    //1.특정 공개된 플레이리스트를 가져옴
    //2.정지된 상태로 가져와 플레이리스트를 자동연속재생하도록 설정
    const API_KEY="AIzaSyCHZR3vYLQs69URyNPotBeWeeyrSafT4yk";
    const Playlist="PL436qxW-X8dcmeQQVOVwDyIufW5_Ksgrm";
    const URL=`https://www.googleapis.com/youtube/?${Playlist}`;



      
}

const Cloth=["민소매, 반팔, 반바지", "반팔, 얇은 셔츠, 면바지",
"얇은 가디건, 청바지", "얇은 니트, 맨투맨, 가디건", "자켓, 가디건, 스타킹",
"자켓, 트렌치코트, 니트", "코트, 히트택, 니트",
"패딩, 코트, 목도리"];

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
        const todayHumidity=weathers[0].getHumidity()-weathers[1].getHumidity();

        const ment1=`오늘 기온은 ${todayTemp}도 입니다. ${Cloth[clothIndex]}을(를) 추천합니다.`;
        const ment2=gapTemp>0 ? `어제보다 ${gapTemp}도 덥습니다.`: `어제보다 ${-gapTemp}도 춥습니다.`;
        const ment3=todaySky=="Rain" ? "\n우산을 챙기세요!" : "";
        const ment4=todayHumidity>0 ? "어제보다 습합니다.": "어제보다 건조합니다.";

        return (
            <>{`${ment1}\n${ment2}\n${ment3}\n${ment4}`}</>
        )
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
        const data=await (await fetch(url)).json();
        let day=now=="today" ? data : data.list[0];
        const temp= KtoC(day.main.temp_max); 
        const humidity=day.main.humidity;
        const weather=(day.weather)[0].main;
        return new DayWeather(temp, humidity, weather);
    }

    const onGeoOk=async(position)=> {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setGeo([lat, lon]);
       
    }
    function onGeoError() {
        return ("Gps is off");
    }

    function KtoC(tem){
        return (parseInt(tem)-273.15).toFixed(0);
    }

    const getData = async()=>{
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
    }

    const load =async()=> {
        navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
        setLoading(false);
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



    let storage=window.localStorage.getItem("Todolist");
    const [todos, setTodos]=useState(storage==null ? new Array():storage.split(","));
    const [todo, setTodo]=useState("");

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

    const editTodoStart=(e)=>{
        e.target.readOnly=false;
        e.value
    }

    const editTodoEnd=(e)=>{
        const editText=e.target.value;

        if (e.key == 'Enter' && editText!="") {

            e.target.readOnly=true;
        }
    }

    let index=0;
    
    return (
    <> 
     <input type="text" onKeyPress={EnterKey} />
    <ul>
        
       {todos.map((x)=>x!="" ? <li className="todos" key={index}>
        <input type="text" value={x} readOnly={true} onDoubleClick={editTodoStart}  onKeyPress={editTodoEnd}/>
    <input type="checkbox" onChange={deleteCheckbox} value={index++} checked={false}/>
    </li>: "")
    }

   </ul>
    
    </>
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

    const load =async()=> {setLoading(false); }

    const getData=async()=>{
        const data=(await (await fetch(URL)).json()).realtimeArrivalList;
        setData(data);
    } 

    function Subwaydiv(){
        if(times=="") {return false};
        return(
            <>
                노들역:
                {times.map((x)=>`다음 기차까지 남은 시간: ${x}`)}
            </>
        )
    }

    return(<>
            {loading ?  "" : <Subwaydiv/>}
    </>);
}

export {Checkboxes, Api}