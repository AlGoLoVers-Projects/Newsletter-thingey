import React from 'react';
import './App.css';
import {useRoutes} from "react-router-dom";
import {buildRoutes} from "./router/routes";

export default function App() {
  return useRoutes(buildRoutes());
}
