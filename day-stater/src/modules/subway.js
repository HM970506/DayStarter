import {useEffect, useState, React} from "react";

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

export default Subway;