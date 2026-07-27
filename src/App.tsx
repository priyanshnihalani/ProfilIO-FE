import './App.css'
import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Login from './pages/Login'
import Home from './pages/Home'
import TemplateGallery from './pages/Template'
import Signup from './pages/Signup'
import Pricing from './pages/Pricing'
import NotFound from './pages/NotFound'
import WelcomeScreen from './components/WelcomeScreen'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import { AuthGuard, GuestGuard } from './components/auth/Guards'
import GithubCallback from './pages/GithubCallback'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "templates",
        element: (
          <AuthGuard>
            <TemplateGallery />
          </AuthGuard>
        ),
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-and-conditions",
        element: <TermsAndConditions />,
      },
    ]
  },
  {
    path: "/login",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestGuard>
        <Signup />
      </GuestGuard>
    ),
  },
  {
    path: "/auth/github",
    element: (
      <GuestGuard>
        <GithubCallback />
      </GuestGuard>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  }
])

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <WelcomeScreen onComplete={() => setLoading(false)} />;
  }

  return <RouterProvider router={router} />;
}

export default App
