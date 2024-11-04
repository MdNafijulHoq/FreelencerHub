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
import PrivateRoute from './PrivateRoute/PrivateRoute';
import MyBids from './pages/MyBids';
import BidRequest from './pages/BidRequest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AllJobs from './pages/AllJobs';

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
        path: '/all-jobs',
        element: <AllJobs></AllJobs>,
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
        element: <PrivateRoute><JobDetails></JobDetails></PrivateRoute>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`),
      },
      {
        path: '/update/:id',
        element: <PrivateRoute><UpdateJob></UpdateJob></PrivateRoute>,
        loader: ({params}) => fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`),
      },
      {
        path: '/add-job',
        element: <PrivateRoute><AddJob></AddJob></PrivateRoute>,
      },
      {
        path: '/my-posted-jobs',
        element: <PrivateRoute><MyPostedJobs></MyPostedJobs></PrivateRoute>,
      },
      {
        path: '/my-bids',
        element: <PrivateRoute><MyBids></MyBids></PrivateRoute>,
      },
      {
        path: '/bid-requests',
        element: <PrivateRoute><BidRequest></BidRequest></PrivateRoute>,
      },
      
    ],
  },
]);

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <div className='max-w-7xl font-lato mx-auto'>
                <RouterProvider router={router} />
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
         <Toaster></Toaster>
    </AuthProvider>
  </StrictMode>,
)
