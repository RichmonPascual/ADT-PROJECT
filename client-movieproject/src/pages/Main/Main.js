import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />


function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const handleLogout = () => {
    const yesLogout = window.confirm
      ('Do you want to logout?');
    if (yesLogout) {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);
  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <h1 c>NETFLIX</h1>
            <br />
            <li className='Movie'>
              <img src='home.png' width={33} onClick={() => navigate('/')} />
            </li>
            <li className='Menu'>
              <img src='interface.png' width={44} />
            </li>
            <li className='Settings'>
              <img src='gear.png' width={44} />
            </li>
            {accessToken ? (
              <li className='logout'>
                <img className='logout-img' src='logout.png' width={38} onClick={handleLogout} />
              </li>
            ) : (
              <li className='login'>
                <a onClick={() => navigate('/login')}>Login</a>
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
