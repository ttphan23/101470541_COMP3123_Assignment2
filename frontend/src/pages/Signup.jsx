import React, { useState } from 'react';
import { signup } from '../api/users';
import { isEmail, required } from '../utils/validate';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!required(form.username)) e.username = 'Username is required';
    if (!isEmail(form.email)) e.email = 'Valid email is required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      setBusy(true);
      await signup(form);
      nav('/login');
    } catch (err) {
      setServerError('Signup failed. Try a different email/username.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container my-4" style={{maxWidth: 480}}>
      <h2 className="mb-3">Sign up</h2>
      {serverError && <div className="alert alert-danger">{serverError}</div>}
      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className={`form-control ${errors.username ? 'is-invalid' : ''}`} name="username" value={form.username} onChange={onChange}/>
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>
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
        <button disabled={busy} className="btn btn-primary w-100">{busy ? 'Creating...' : 'Create account'}</button>
      </form>
      <div className="mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
