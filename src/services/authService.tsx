import axios from "axios";
import type  { RegisterData } from "../types/registerData";
import type { LoginData } from "../types/loginData";

class authService {
    async signUp(registerData: RegisterData) {
        const { data } = await axios.post(
            "https://route-posts.routemisr.com/users/signup",
            registerData
        );
        return data;
    }
    async signIn(loginData: LoginData) {
        const { data } = await axios.post(
            "https://route-posts.routemisr.com/users/signin",
            loginData
        );
        return data;
    }

    async  getUserData(){
        const {data} = await axios.get("https://route-posts.routemisr.com/users/profile-data", {
            headers:{
                token:localStorage.getItem("token")

            }
           
        })
         return data;
    }
}

export const AuthService = new authService();
