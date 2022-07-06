import React from 'react';
import ReactDOM from 'react-dom/client';
import {Helmet} from "react-helmet";
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <>    <App />
    
    <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>

    </Helmet>
    </>

);