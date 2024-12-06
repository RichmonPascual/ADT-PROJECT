import { useState, useRef, useCallback } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [role, setRole] = useState('');
  const [hasDirtyFields, setHasDirtyFields] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const contactNoInputRef = useRef();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('idle');
  const [errorText, setErrorText] = useState('');

  const navigate = useNavigate();

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prev => !prev);
  }, []);

  const handleInputChange = (event, fieldType) => {
    setHasDirtyFields(true);
    switch (fieldType) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'middleName':
        setMiddleName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'contactNo':
        setContactNo(event.target.value);
        break;
      case 'role':
        setRole(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleRegistration = async () => {
    const userData = { email, password, firstName, middleName, lastName, contactNo, role };
    setLoadingStatus('loading');
    setErrorText(''); // Clear any previous error messages

    try {
      const response = await axios.post('/admin/register', userData);
      console.log(response);
      navigate('/main/dashboard');
    } catch (error) {
      console.error(error);
      setErrorText(error.response ? error.response.data.message : 'Registration failed');
    } finally {
      setLoadingStatus('idle');
    }
  };

  return (
    <div className='Register'>
      <div className='main-container'>
        {errorText && <div className="error-message">{errorText}</div>}
        <form>
          <div className='form-container'>
          <h3>Register</h3>
          <br></br>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Email'
                ref={emailInputRef}
                onChange={(e) => handleInputChange(e, 'email')}
              />
              {hasDirtyFields && email === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='form-group'>
              <input
              placeholder='Password'
                type={isPasswordVisible ? 'text' : 'password'}
                ref={passwordInputRef}
                onChange={(e) => handleInputChange(e, 'password')}
              />
              {hasDirtyFields && password === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='form-group'>
              <input
                type='text'
                placeholder='First Name'
                ref={firstNameInputRef}
                onChange={(e) => handleInputChange(e, 'firstName')}
              />
              {hasDirtyFields && firstName === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Middle Name'
                onChange={(e) => handleInputChange(e, 'middleName')}
              />
            </div>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Last Name'
                ref={lastNameInputRef}
                onChange={(e) => handleInputChange(e, 'lastName')}
              />
              {hasDirtyFields && lastName === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Contact No.'
                ref={contactNoInputRef}
                onChange={(e) => handleInputChange(e, 'contactNo')}
              />
              {hasDirtyFields && contactNo === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='form-group'>
              <select onChange={(e) => handleInputChange(e, 'role')}>
                <option value=''>Select Role</option>
                <option value='admin'>Admin</option>
                <option value='user'>User</option>
                {/* Additional roles can be added here */}
              </select>
              {hasDirtyFields && role === '' && (
                <span className='errors'>This field is required</span>
              )}
            </div>
            <div className='show-password' onClick={togglePasswordVisibility}>
              {isPasswordVisible ? 'Hide' : 'Show'} Password
            </div>
            <div className='submit-container'>
              <button
                type='button'
                disabled={loadingStatus === 'loading'}
                onClick={() => {
                  if (loadingStatus === 'loading') {
                    return;
                  }
                  if (email && password && firstName && lastName && contactNo && role) {
                    handleRegistration();
                  } else {
                    setHasDirtyFields(true);
                    if (email === '') {
                      emailInputRef.current.focus();
                    } else if (password === '') {
                      passwordInputRef.current.focus();
                    } else if (firstName === '') {
                      firstNameInputRef.current.focus();
                    } else if (lastName === '') {
                      lastNameInputRef.current.focus();
                    } else if (contactNo === '') {
                      contactNoInputRef.current.focus();
                    } else if (role === '') {
                      document.querySelector('select').focus();
                    }
                  }
                }}
              >
                {loadingStatus === 'idle' ? 'Register' : 'Loading'}
              </button>
            </div>
            <div className='login-container'>
            <Link to ="/">
                <small>Already have an account? Login</small>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
