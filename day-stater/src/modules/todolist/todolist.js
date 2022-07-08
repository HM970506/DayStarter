import {useEffect, useState, React} from "react";
import {connect} from 'react-redux';
import { addToDo, deleteToDo, modifyToDo } from "./store.js";


//훅을 반복문안에서 출력하면 안된다아아아
//input은 계속 훅이 있어야 하지만, todo는 modify 시점에서만 수정이 가능하면 된다.
//..훅 필요없는거같은디?? 엔터쳤을때 그냥 웹스토리지 저장하면 될거같은디?


    //삭제했을 때의 애니메이션도 추가하기!
    //grid로 div 늘리기를 할 방법 고안해보기
    //checkbox체크값 로컬스토리지 저장하기
    //따릉이 api를 추가해볼가나?????🤭  --> 신청했다!🤸‍♀️




function Todolist({toDos, addToDo, deleteToDo, modifyToDo}){

    useEffect(() => { window.localStorage.setItem("Todolist", toDos);}, [toDos]); //toDos가 수정될 때마다 localstorage 수정


    const useInput=()=>{ 
            const [value, setValue] = useState("");
            const onChange=(e)=>{ 
                setValue(e.target.value);
            }
        
            const clear=()=>{
                setValue("");
            }
    
        
        const onKeyPress=(e)=>{ 
            console.log("엔터");
            if (e.key === 'Enter' && e.target.value!=="") {
                addToDo(e.target.value);
                clear();
            }   
        }
        return {value, onChange, onKeyPress};
      }

    const todoDiv=()=>{
        const onDoubleClick=(e)=>{
            const textarea=e.target.nextSibling;
            e.target.classList.add("Hyde");
            textarea.classList.remove("Hyde");
            textarea.readOnly=false;
            textarea.focus();
        //    textarea.value=e.target.value;
        }
        return {onDoubleClick};
    }

    const todoTextarea=(value)=>{ 
        //value가 지정되어 있다면, state를 이용해 관리하는 것밖에 방법이 없나?
        //todo마다 state를 써서 관리해주고싶진 않은데...그럼 redux쓴 의미가 없잔어
        //value지정을 안해주면 modifty의 의미가 없고............................
        //어떻게해야할가나🤔...............................................
        //

        const changeHeihgt=(e)=>{ //15가 아니라 부모 현재 가로크기를 받아와야 할거같은데.. 나중에 수정!!
            const height=Math.round(e.currentTarget.scrollHeight/15)+"em"
            e.target.style.height= height;
        }

        const onChange=(e)=>{
            changeHeihgt(e);
        }

        const onKeyPress=(e)=>{ 
            if (e.key === 'Enter') {
                if(e.target.value!==""){
                    modifyToDo({"value":e.target.value, "idx":e.target.getAttribute("idx")});
                    //다시 랜더됨
                }
                else{
                    e.target.readOnly="true";
                    e.target.style={display:"none"};
                    e.target.previousSibling.style={display:""};
                    //다시 랜더되지 않음
                }
            }
        }

        return {value, onChange, onKeyPress}
    }

    const Todo=(props)=>{
        const divInput = todoDiv();
        const textareaInput = todoTextarea(props.value);

        return(
            <li className="todos" key={props.idx} idx={props.idx}>
                <div className="todoDiv" type="text" {...divInput}>{props.value}</div>
                <textarea className="todoTextarea Hyde" {...textareaInput} readOnly="true" idx={props.idx}></textarea>
                <input className="todoCheckbox" type="checkbox" onChange={()=>{deleteToDo(props.idx)}} checked={false}/>
            </li>
        )
    }

    const input=useInput();
    //todos가 수정될 때마다 리랜더됨
    return (
    <div className="apiframe" id="todolistframe"> 
        <input type="text" placeholder="todo.." {...input} />
                <ul>
                    {toDos.map((x, idx)=>x!=="" ? <Todo value={x} idx={idx}/> : "")}
               </ul>
    </div>
    );
    
}


function mapStateToProps(state) {
    return { toDos: state };  //리듀서에서 관리하는 state값을 가져옴.
  }
  
  function mapDispatchToProps(dispatch, ownProps) {
    return {
        addToDo: value => dispatch(addToDo(value)),
        deleteToDo: idx => dispatch(deleteToDo(idx)),
        modifyToDo: toDo => dispatch(modifyToDo(toDo))
    };
  }
  
export default connect(mapStateToProps, mapDispatchToProps) (Todolist);

