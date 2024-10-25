import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './Root/Root';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AuthProvider from './AuthContext/AuthProvider';
import Home from './pages/Home';
import {Toaster} from 'react-hot-toast'
import JobDetails from './pages/JobDetails';
import AddJob from './pages/AddJob';
import ErrorPage from './pages/ErrorPage';
import MyPostedJobs from './pages/MyPostedJobs';
import UpdateJob from './pages/UpdateJob';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>,
      },
      {
        path: '/login',
        element: <Login></Login>,
      },
      {
        path: '/registration',
        element: <Registration></Registration>,
      },
      {
        path: '/job/:id',
        element: <JobDetails></JobDetails>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`),
      },
      {
        path: '/update/:id',
        element: <UpdateJob></UpdateJob>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`),
      },
      {
        path: '/add-job',
        element: <AddJob></AddJob>,
      },
      {
        path: '/my-posted-jobs',
        element: <MyPostedJobs></MyPostedJobs>,
      },
      
    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
        <div className='max-w-7xl font-lato mx-auto'>
            <RouterProvider router={router} />
         </div>
         <Toaster></Toaster>
    </AuthProvider>
  </StrictMode>,
)
