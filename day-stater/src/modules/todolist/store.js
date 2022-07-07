import { configureStore, createSlice } from "@reduxjs/toolkit";
const localstroage=window.localStorage.getItem("Todolist");
const defaultState=(localstroage == null ||localstroage==="") ? []:window.localStorage.getItem("Todolist").split(",");

function indexDelete(newTodos, delIndex){
    return (newTodos.slice(0,delIndex)).concat(newTodos.slice(delIndex+1));
} 

const toDos=createSlice({
    name:"toDosReducer",
    initialState: defaultState,
    reducers:{
        addToDo: (state, toDo)=>{state.push(toDo.payload)},
        deleteToDo: (state, toDo)=>{return indexDelete(state, toDo.payload)},
        modifyToDo: (state, toDo)=>{state[toDo.payload.idx]=toDo.payload.value}
    }

});


export const {addToDo, deleteToDo, modifyToDo} = toDos.actions;

export default configureStore({reducer:toDos.reducer});