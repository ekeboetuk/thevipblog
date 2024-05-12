//React Libraries/Modules Import
import React, { StrictMode, createContext } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, ScrollRestoration } from "react-router-dom";

//3rd Party Libraries/Modules Import
//import {KindeProvider} from "@kinde-oss/kinde-auth-react";
import { HelmetProvider } from "react-helmet-async";

//Styles Import
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-loading-skeleton/dist/skeleton.css"
import "./styles.css";

//Components Import
import Routes from "./components/routes.js";

export const userContext = createContext()

function Afriscope() {
  const helmetContext = {};
  const router = createBrowserRouter(Routes())

  return (
    <HelmetProvider context={helmetContext}>
      <RouterProvider router={router} >
        <ScrollRestoration getKey={(location, matches) => {
            return location.pathname;
        }}/>
      </RouterProvider>
    </HelmetProvider>
  )
};


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <StrictMode>
      <Afriscope />
  </StrictMode>
);