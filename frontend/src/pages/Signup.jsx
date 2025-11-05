import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/users';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await signup(form);
      setMsg('Signup successful. Please login.');
      setTimeout(() => nav('/'), 800);
    } catch {
      setMsg('Signup failed.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '48px auto', fontFamily: 'system-ui' }}>
      <h2>Signup</h2>
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={onChange}
          required
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          style={{ width: '100%', padding: 8, marginBottom: 12 }}
        />
        {msg && <div style={{ color: '#0a7', marginBottom: 12 }}>{msg}</div>}
        <button type="submit" style={{ padding: '8px 14px' }}>Create Account</button>
      </form>
      <div style={{ marginTop: 12 }}>
        Have an account? <Link to="/">Login</Link>
      </div>
    </div>
  );
}
