import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async (e) => {

        e.preventDefault();

        try {

            await API.post("/auth/register", {

                name,
                email,
                password

            });

            toast.success("Registration Successful");

            navigate("/");

        }

        catch (err) {

            toast.error(err.response?.data?.message || "Registration Failed");

        }

    };

    return (

        <div>

            <h2>Register Page</h2>

            <form onSubmit={registerUser}>

                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />

                <br /><br />

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">

                    Register

                </button>

            </form>

        </div>

    );

}

export default Register;