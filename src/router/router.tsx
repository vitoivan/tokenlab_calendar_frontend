import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "../pages/login/login";
import { HomePage } from "@/pages/home/home";
import { withAuth } from "@/components/auth/auth";
import { Page404 } from "@/pages/404/not-found";
import { Routes } from "@/utils/enums";
import { RegisterPage } from "@/pages/register/register";


export const router = createBrowserRouter([
  {
    path: Routes.SIGN_IN,
    element: <LoginPage />,
  },
  {
    path: Routes.SIGN_UP,
    element: <RegisterPage />,
  },
  {
    path: Routes.HOME,
    element: withAuth(<HomePage />),
  },
  {
    path: '/',
    element: <Navigate to={Routes.HOME} />,
  },
  {
    path: "*",
    element: <Page404 />,
  },
]);
