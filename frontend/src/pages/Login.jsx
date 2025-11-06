import React, { useState } from 'react';
import { login } from '../api/users';
import { isEmail, required } from '../utils/validate';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!isEmail(form.email)) e.email = 'Valid email is required';
    if (!required(form.password)) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      setBusy(true);
      const { data } = await login(form);
      localStorage.setItem('token', data.jwt_token);
      nav('/employees');
    } catch (err) {
      setServerError('Invalid email or password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container my-4" style={{maxWidth: 480}}>
      <h2 className="mb-3">Log in</h2>
      {serverError && <div className="alert alert-danger">{serverError}</div>}
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={form.email} onChange={onChange}/>
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} name="password" value={form.password} onChange={onChange}/>
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button disabled={busy} className="btn btn-primary w-100">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div className="mt-3">
        No account? <Link to="/signup">Create one</Link>
      </div>
    </div>
  );
}
