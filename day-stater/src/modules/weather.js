import {useEffect, useState, React} from "react";

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
        const clothIndex=whatCloth(todayTemp);
        const todaySky=weathers[0].getWeather();

        return (
            <div id="weatherframe">
                <div><div className="center"><WeatherIcon value={todaySky}/></div><div className="center"><h3>{todayTemp}℃</h3></div></div>
                <div><h4>추천 복장</h4><div>{Cloth[clothIndex]}</div></div>
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
export default Weather;