import '../forms.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../AuthContext';
import { auth } from '../firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setTimeActive } = useAuthValue();
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (!auth.currentUser.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              setTimeActive(true);
              navigate('/verify-email');
            })
            .catch((err) => alert(err.message));
        } else {
          navigate('/');
        }
      })
      // .catch((err) => setError(err.message));
      .catch((err) => {
        switch (err.code) {
          case 'auth/wrong-password':
            setError('Invalid password');
            break;

          case 'auth/user-not-found':
            setError('Email not found');
            break;

          default:
            console.log(err.message);
            console.log(err.code);
            break;
        }
      });
  };

  return (
    <div className=" center-it center">
      <div className="auth">
        <h1 className="">Log in</h1>
        {error && <div className="auth__error">{error}</div>}
        <form onSubmit={login} name="login_form">
          <input
            className="hover"
            type="email"
            value={email}
            required
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="hover"
            type="password"
            value={password}
            required
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <div>
          <Link to="/reset">Forgot Password?</Link>
        </div>
        <p>
          Don't have and account?
          <Link to="/register">Create one here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
