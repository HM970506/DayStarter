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
    //redux로 todo들의 state를 관리하여 props drilling을 방지하자!
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
                if(e.target.value==="") setValue(props.firstValue);
                else modifyTodo(e);
            }
        }



        return {value, onDoubleClick, onKeyPress, onChange}

    }
    
    //todos내용물이 많아서 줄이 바뀌면 그게 반영되어서 li와 textarea의 크기도 커져야 한다고~~~
    //만든 이후에 각 스크롤 크기에 맞추는 순회함수를 한번 돌린다면?!?!
    //안된다.. 순회후에 한번 더 랜더해야하는 구조...
    //그렇다면 처음부터 내용물에 딱 맞는 크기로 todo가 들어온다면???
    //textarea의 경우 height: auto; 속성값을 사용하여 자동으로 높이 조절이 되지 않음..!
    //출력하는 녀석을 input으로 둬서 auto가 적용되게 한다면..?
    //textarea가 아니면 여러 줄 입력을 받지 못함..!
    //그렇다면 textarea와 li의 height를 useState로 줘서 실시간 재랜더가 가능하게 하자!
    //실시간 재랜더라는 아이디어로 높이 조절 함수를 위에걸로 줄일 수 있게 되긴 했는데......
    //다시 원점으로 돌아왔다.. textarea를 처음에 만들 때부터 height조절이 자동으로 되게 하려면 어떻게 해야 할까
    //textarea가 아니라 div로 두고, 더블클릭시 해당 div를 지우고 textarea를 두는 것은 어떨까 -> 돔 직접 수정은 위험해!
    //클릭했을때 수정을 위한 모달창을 띄우면 어떨까 -> 괜찮구만 이걸로 하자 모달창 연습도 할 겸..

    const Todo=(props)=>{
        const input = useTodoInput(props.firstValue);

        return(
            <li className="todos" key={props.idx} idx={props.idx}>
                <textarea className="todo" type="text" readOnly={true} {...input}/>
                <input type="checkbox" onChange={deleteTodo} checked={false}/>
            </li>
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
                    {todos.map((x, idx)=>x!=="" ? <Todo firstValue={x} idx={idx}/> : "")}
               </ul>
    </div>
    );
}
export default Todolist;

