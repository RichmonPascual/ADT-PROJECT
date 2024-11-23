import React from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Register() {
    return (
        <div className='register-container'>
            <a href='/register'>
                <h1>Register</h1>
            </a>
        </div>
    );
}
export default Register;