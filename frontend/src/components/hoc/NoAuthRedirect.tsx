import React from "react";
import { Navigate } from "react-router-dom";

interface UserData {
    id: string;
    username: string;
    picture: string;
    balance: string;
    experience: string;
    level: string;
    email: string;
    first_name: string;
    role: string;
    password: string;
}
    
interface Props {
    isAuthenticated: boolean;
    userData: UserData;
  }
  
  export const NoAuthorization = (Component:any) => {
    class RedirectComponent extends React.Component<Props> {
        
        render() {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                return <Navigate to="/" />
            } else {
                return <Component {...this.props} />
            }
        }
    }
    return RedirectComponent;
}