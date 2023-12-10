import React from 'react';
import {useRoutes} from "react-router-dom";
import {buildRoutes} from "./router/route-builder";

export default function App() {
  return useRoutes(buildRoutes());
}
