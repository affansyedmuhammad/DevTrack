import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';

const Createacc = () => {
    const [username, setusername] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [error, setError] = useState("");

    const validatePassword = (password) => {
        const minLength = 8;
        const nonAlphaRegex = /[^a-zA-Z]/; // At least one non-alphabetic character
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

        if (password.length < minLength) {
            return "Password must be at least 8 characters long.";
        }
        if (!nonAlphaRegex.test(password)) {
            return "Password must contain at least one non-alphabetic character.";
        }
        if (!specialCharRegex.test(password)) {
            return "Password must contain at least one special character.";
        }
        return "";
    };

    const handleSubmit = (e) => {
        const passwordError = validatePassword(password);
        if (passwordError) {
            e.preventDefault();
            setError(passwordError);
            return;
        }
        if (password !== confirmpassword) {
            e.preventDefault();
            setError("Passwords do not match.");
            return;
        }
        const secretKey = "ENPM680Fall2024Project-smaffan-devtracksecretkey";

        const hashedPassword = sha256(`${password}`).toString();
        setpassword(hashedPassword);

        const hashedConfirmedPassword = sha256(`${confirmpassword}`).toString();
        setconfirmpassword(hashedConfirmedPassword);


        // const encPassword = CryptoJS.AES.encrypt(`${password}`, secretKey); 
        // setpassword(encPassword);

        // const encConfirmPassword = CryptoJS.AES.encrypt(`${confirmpassword}`, secretKey); 
        // setconfirmpassword(encConfirmPassword);

        setError(""); // Clear any previous errors
    };

    return (
        <html>
            <body>
                <br />
                <form 
                    className="form-group" 
                    method="POST" 
                    action="http://localhost:9000/createacc"
                    onSubmit={handleSubmit}
                >
                    Enter your username: 
                    <input 
                        type="text" 
                        onInput={(e) => setusername(e.target.value)} 
                        className="form-control-lg" 
                        name="username" 
                        value={username} 
                    />
                    <br /><br />
                    Enter your email: 
                    <input 
                        type="text" 
                        onInput={(e) => setemail(e.target.value)} 
                        className="form-control-lg" 
                        name="email" 
                        value={email} 
                    />
                    <br /><br />
                    Enter your password: 
                    <input 
                        type="password" 
                        onInput={(e) => setpassword(e.target.value)} 
                        className="form-control-lg" 
                        name="password" 
                        value={password} 
                    />
                    <br /><br />
                    Confirm your password: 
                    <input 
                        type="password" 
                        onInput={(e) => setconfirmpassword(e.target.value)} 
                        className="form-control-lg" 
                        name="confirmpassword" 
                        value={confirmpassword} 
                    /> 
                    <br /><br />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button className="btn btn-danger" type="submit">Create</button>
                    <button 
                        style={{ marginLeft: "10%" }} 
                        className="btn btn-danger" 
                        onClick={(e) => {
                            e.preventDefault();
                            setusername("");
                            setemail("");
                            setpassword("");
                            setconfirmpassword("");
                            setError("");
                        }}
                    >
                        Clear
                    </button>
                    <Link to="/" style={{ marginLeft: "13%" }} className="btn btn-danger">
                        Back
                    </Link>
                </form>
            </body>
        </html>
    );
};

export default Createacc;
