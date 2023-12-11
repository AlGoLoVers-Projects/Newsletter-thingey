import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter} from 'react-router-dom'
import App from "./App";
import {Provider} from "react-redux";
import store from "./redux/store";
import {ThemeProvider} from "@mui/material";
import {buildTheme} from "./theme/theme";
import {ToastContainer} from "react-toastify";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ThemeProvider theme={buildTheme()}>
                    <ToastContainer/>
                    <App/>
                </ThemeProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);