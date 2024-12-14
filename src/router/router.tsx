import {
  createBrowserRouter,
} from "react-router-dom";
import { LoginPage } from "../pages/login/login";
import { HomePage } from "@/pages/home/home";
import { withAuth } from "@/components/auth/auth";
import { Page404 } from "@/pages/404/not-found";
import { Routes } from "@/utils/enums";
import { Logout } from "@/components/logout/logout";


export const router = createBrowserRouter([
  {
    path: Routes.SIGN_IN,
    element: <LoginPage />,
  },
  {
    path: Routes.HOME,
    element: withAuth(<HomePage />),
    loader: () => {
      console.log("loader run")
      return {}
    },
    errorElement: Logout,
  },
  {
    path: "*",
    element: <Page404 />,
  },
]);
