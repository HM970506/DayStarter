import {useEffect, useState, React} from "react";

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

        
        const resize=(e)=>{
            console.log(e.target.styleheight);
            e.target.styleheight=e.target.scrollHeight+12+'px';
        }
    
        return(
            <textarea className="todo" type="text" value={value} readOnly={true} onChange={onchange} onDoubleClick={editTodoStart} key={props.idx} onKeyDown={resize} onKeyUp={resize} onKeyPress={editTodoEnd}/>
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
export default Todolist;