import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ContextProviders } from './context/providers.tsx'
import { router } from './router/router.tsx'
import { RouterProvider } from "react-router-dom";
import "@/css/index.css";
import { Toaster } from './components/ui/toaster.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextProviders>
      <>
        <RouterProvider router={router} />
        <Toaster />
      </>
    </ContextProviders>
  </StrictMode>,
)
