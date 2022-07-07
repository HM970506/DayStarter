import {useEffect, useState, React} from "react";
import {connect} from 'react-redux';
import { addToDo, deleteToDo, modifyToDo } from "./store.js";

function Todolist({toDos, addToDo, deleteToDo, modifyToDo}){

    //모듈화를 해보자고
    //toDos의 초기값은 그럼 어떻게하지.......?


    useEffect(() => { window.localStorage.setItem("Todolist", toDos);}, [toDos]); //toDos가 수정될 때마다 localstorage 수정

    const useInput=(init)=>{  //input hook
        const [value, setValue] = useState(init);
        const onChange=(e)=>{ //input에 값 입력
            const {target:{value}} = e;
            setValue(value);
        }
        const onKeyPress=(e)=>{ //엔터
            if (e.key === 'Enter' && value!=="") {
                addToDo(e.target.value); //이게 실행되지 않고 있는데...
                setValue("");
            }   
        }
         return {value, onChange, onKeyPress};
      }


    const useTodoInput=(props)=>{ //todo hook
        const [value, setValue] = useState(props);

        const onDoubleClick=(e)=>{
            e.target.readOnly=false;
            setValue(e.target.value);
        }

        const changeHeihgt=(e)=>{
            const height=Math.round(e.currentTarget.scrollHeight/15)+"em"
            e.target.style.height= height;
        }

        //줄당 스크롤 15씩 변함
        const onChange=(e)=>{ //input에 값 입력
            setValue(e.target.value);
            changeHeihgt(e);
        }

        const onKeyPress=(e)=>{ 
            if (e.key === 'Enter') {
                if(e.target.value==="") setValue(props.value);
                else modifyToDo({"value":e.target.value, "idx":e.target.getAttribute("idx")});
            }
        }



        return {value, onDoubleClick, onKeyPress, onChange}

    }


    //내일 할일: 출력은 div, 입력은 textarea로 하게끔 조절하기
    //1.testarea의 visivle은 숨기고 div로 input을 출력한다
    //2.input을 더블클릭하면 div를 숨기고 textarea를 보이게 한다
    //3.수정후 enter를 치면 textarea내용을 토대로 modify하여 리랜더한다

    //삭제했을 때의 애니메이션도 추가하기!
    //grid로 div 늘리기를 할 방법 고안해보기
    //checkbox체크값 로컬스토리지 저장하기
    //따릉이 api를 추가해볼가나?????🤭

    const Todo=(props)=>{
        const input = useTodoInput(props.value);

        return(
            <li className="todos" key={props.idx} idx={props.idx}>
                <div className="todo" type="text" {...input}>{input.value}</div>
                <textarea className="todo" visible="none" {...input} readOnly="true" idx={props.idx}/>
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

