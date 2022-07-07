import {useEffect, useState, React} from "react";
import Youtube from "./modules/youtube.js"
import Todolist from "./modules/todolist/todolist.js"
import Subway from "./modules/subway.js"
import Weather from "./modules/weather"
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
        state ? div.className="api" : div.className="api Hyde";
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


export {Checkboxes, Api}