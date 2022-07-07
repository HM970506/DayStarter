import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";

//사용할 액션을 만들어주자
const addToDo=createAction("ADD_TODO");
const deleteToDo=createAction("DELETE_TODO");
const modifyToDo=createAction("MODIFY_TODO");

function indexDelete(newTodos, delIndex){
    return (newTodos.slice(0,delIndex)).concat(newTodos.slice(delIndex+1));
} 
const localstroage=window.localStorage.getItem("Todolist");
const defaultState=(localstroage == null ||localstroage==="") ? []:window.localStorage.getItem("Todolist").split(",");

const reducer=createReducer(defaultState,{
    [addToDo]: (state, toDo)=>{state.push(toDo.payload)},
    [deleteToDo]: (state, toDo)=>{return indexDelete(state, toDo.payload)},
    [modifyToDo]: (state, toDo)=>{state[toDo.payload.idx]=toDo.payload.value;}
})

const store=configureStore({reducer});

export const actionCreators={
    addToDo,
    deleteToDo,
    modifyToDo
};
export default store;