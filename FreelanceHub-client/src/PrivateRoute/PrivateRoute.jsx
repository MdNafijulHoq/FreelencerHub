import React, { Children, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom'

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext)
    const location = useLocation()
    
    if(loading){
        return <p>Loading....</p>
    }

    if(user){
        return children
    }
    return <Navigate to='/login' state={location?.pathname} replace={true}></Navigate>
};

export default PrivateRoute;