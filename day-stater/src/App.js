import {Api, Checkboxes} from "./components.js"
import { Provider } from "react-redux";
import store from "./modules/todolist/store";

function App(){
    return(
        <div>
                <Checkboxes/>
                <Provider store={store}>
                    <Api/>
                </Provider>
        </div>
    )
}
export default App;
