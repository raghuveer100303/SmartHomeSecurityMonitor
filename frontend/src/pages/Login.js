import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginUser = async (e) => {

        e.preventDefault();
        console.log("Login Button Clicked");

        try {
            console.log(API.defaults.baseURL);
            const res = await API.post("/auth/login", {
                email,
                password
            });
            console.log(res.data);

            localStorage.setItem("token", res.data.token);

            toast.success("Login Successful");

            navigate("/dashboard");

        } catch (err) {

    console.log(err);

    console.log(err.response);

    console.log(err.response?.data);

    toast.error(err.response?.data?.message || "Login Failed");

}
    };

    return (

        <div>

            <h2>Login Page</h2>

            <form onSubmit={loginUser}>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;