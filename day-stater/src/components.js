import {useEffect, useState, memo, React} from "react";
import YouTube from "react-youtube";
import style from "./css/style.css";

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
      
      
}

const Cloth=["민소매, 반팔, 반바지", "반팔, 얇은 셔츠, 면바지",
"얇은 가디건, 청바지", "얇은 니트, 맨투맨, 가디건", "자켓, 가디건, 스타킹",
"자켓, 트렌치코트, 니트", "코트, 히트택, 니트",
"패딩, 코트, 목도리"];

class DayWeather{
    construct(temp, humidity, weather){
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
    const [weathers, setWeathers]=useState();

    /*useEffect(makeWeatherdiv(),[weathers]);

    function makeWeatherdiv(){
        const todayTemp=weathers[0].getTemp();
        const gapTemp=weathers[1].getTemp()-weathers[0].getTemp();
        const clothIndex=whatCloth(todayTemp);
        const ment=`오늘 기온은 ${todayTemp}}도 입니다. ${Cloth[clothIndex]}을(를) 추천합니다.\n
                  어제와 ${gapTemp}도 차이납니다.`;

        return ment;
    }
*/
    
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
        let day;
        
        now=="today" ? day=data : day=data.list[0];

        const temp= KtoC(day.main.feels_like);
        const humidity=day.main.humidity;
        const weather=(day.weather)[0].main;

        return new DayWeather(temp, humidity, weather);
    }

    const onGeoOk=async(position)=> {
   
        const API_key="630b5303f9175771e71dd96d35fa650c";
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const utc =  Math.floor(new Date().getTime() / 1000);
        const start=utc-86400;
        const end=start+3600;
        const todayURL= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`;
        const yesterURL=`http://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lon}&type=hour&start=${start}&end=${end}&appid=${API_key}`;
        const todayWeather = await getWeather(todayURL, "today");
        const yesterdayWeather =  await getWeather(yesterURL, "yesterday");
        const [loading, setLoading]=useState(false)
        setWeathers([todayWeather, yesterdayWeather]);

        
    }
    function onGeoError() {
        return ("Gps is off");
    }

    function KtoC(tem){
        return (parseInt(tem)-273.15).toFixed(0);
    }

    function load()
    {
        ()=>async()=>{
            await navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
            setLoading(loading, true);
        }
    }
    useEffect(load(),[]);
    //useEffect에 await를 겹쳐서 쓸 ㅅ 있나?
    console.log(weathers);
    return(
        <div>  
            loading==true?(weather):()
        </div>

    )
}


function Todolist(){
    //엔터키를 치면, 리스트에 해당 input 저장
    //추가된 input은 더블클릭시 수정가능
    //체크시 background색이 변한뒤 사라지는 애니메이션 + 리스트에서 내용 수정
    //리스트가 수정될 때마다 웹스토리지값이 변화

    //즉, state는 2개가 필요
    //1.input button을 누를 때마다 list를 변화시키는 state
    //2.list가 변화할 때마다 storage를 변화시키는 state
    //+별도로 checkbox를 누를 때마다 list에서 해당 인덱스를 삭제
    return ("todolist");
}


function Subway(){
    const API_KEY="4478437159303530313233626b70464b";
    const gateId=4118; //나중에 역 이름 입력받아서 할 수 있게 하기

    //1.해당 시간의 값을 가져옴
    //2.update button을 누를 때마다 api를 새로 가져옴
    return("subway");
}

export {Checkboxes, Api}