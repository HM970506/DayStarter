import {useEffect, useState, React} from "react";
import {Provider, useDispatch} from 'react-redux';
import {createStore, createReducer} from '@reduxjs/toolkit'

function Todolist(){
    //엔터키를 치면, 리스트에 해당 value 저장
    //추가된 value은 클릭시 수정가능
    //체크시 background색이 변한뒤 사라지는 애니메이션 + 리스트에서 내용 수정
    //리스트가 수정될 때마다 웹스토리지값이 변화

    //즉, state는 2개가 필요
    //1.value button을 누를 때마다 list를 변화시키는 state
    //2.list가 변화할 때마다 storage를 변화시키는 state
    //+별도로 checkbox를 누를 때마다 list에서 해당 인덱스를 삭제

    //react에서는 dom을 건드리면 안 됨.
    //value value값 수정시 해당값 고정이므로 각 list마다 value를 가지는 usestate를 만들어주어야 함.

    //가능한 여러 훅을 사용해보자!
    //redux로 todo들의 state를 관리해보자!
    //visibility가 false면 인덱스 밀림!!!!! 리랜더해야함!!!


    const [todos, setTodos]=useState(window.localStorage.getItem("Todolist") == null || window.localStorage.getItem("Todolist")==="" ? []:window.localStorage.getItem("Todolist").split(","));
    useEffect(() => { window.localStorage.setItem("Todolist", todos);}, [todos]); //todos가 수정될 때마다 localstorage 수정
    function indexDelete(newTodos, delIndex){return (newTodos.slice(0,delIndex)).concat(newTodos.slice(delIndex+1));} 



    const countStore=createStore(reducer);

    const ADD_TODO = "ADD_TODO";
    const DELETE_TODO = "DELETE_TODO";
    const MODIFY_TODO = "MODIFY_TODO";


    function reducer(currentTodos=todos, action){ 
        let newTodos=[...currentTodos]; //불변성 유지

        switch (action.type){
            case "ADD_TODO":
                newTodos.push(action.todo);
                return newTodos; //return된 값으로 state가 유지됨
            case "DELETE_TODO": 
                newTodos=indexDelete(newTodos, action.idx); 
                return newTodos;
            case "MODIFY_TODO":
                newTodos[action.idx]=action.todo;
                return newTodos;
            default:
                return newTodos;
        }

    }

    countStore.subscribe(()=>{setTodos(countStore.getState())}); //변화가 있을 때마다 감지하여 todos 수정

    const useInput=(init)=>{  //input hook
        const [value, setValue] = useState(init);
        const onChange=(e)=>{ //input에 값 입력
            const {target:{value}} = e;
            setValue(value);
        }
        const onKeyPress=(e)=>{ //엔터
            if (e.key === 'Enter' && value!=="") {
                addTodo(e);
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

        const onChange=(e)=>{ //input에 값 입력
            const {target:{value}} = e;
            setValue(value);
        }
    
        const onKeyPress=(e)=>{ 
            if (e.key === 'Enter') {
                const {target:{value}} = e;
                if(value==="") setValue(props.firstValue);
                else modifyTodo(e);
                e.target.readOnly=true;
            }
        }

        const onKeyUp=(e)=>{
            console.log(e.target.scrollHeight);
            e.target.parentNode.style.height=e.target.parentNode.scrollHeight+"px";
        }
    

        return {value, onDoubleClick, onKeyPress, onKeyUp, onChange}

    }
    
    const Todo=(props)=>{
        const input = useTodoInput(props.firstValue);
    
        return(
            <>
            <textarea className="todo" type="text" readOnly={true} {...input}/>
            <input type="checkbox" onChange={deleteTodo} checked={false}/>
            </>
        )
    }


    const addTodo=(e)=>{ countStore.dispatch({type:ADD_TODO, todo:e.target.value, idx:todos.length});}
    const deleteTodo=(e)=>{countStore.dispatch({type:DELETE_TODO, todo:"", idx:parseInt(e.target.parentNode.getAttribute('idx'))});}
    const modifyTodo=(e)=>{ countStore.dispatch({type:MODIFY_TODO, todo:e.target.value, idx:parseInt(e.target.parentNode.getAttribute('idx'))});}

    const input=useInput();

    //todos가 수정될 때마다 리랜더됨
    return (
    <div className="apiframe" id="todolistframe"> 
        <input type="text" placeholder="todo.." {...input} />
                <ul>
                    {todos.map((x, idx)=>x!=="" ?
                     <li className="todos" key={idx} idx={idx}>
                        <Todo firstValue={x}/>
                     </li>: "")
                     }

               </ul>
    </div>
    );
}
export default Todolist;