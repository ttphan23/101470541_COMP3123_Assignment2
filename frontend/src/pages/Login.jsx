import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/users';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await login(form);
      localStorage.setItem('token', data.jwt_token);
      nav('/employees');
    } catch (e) {
      setErr('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '48px auto', fontFamily: 'system-ui' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
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
        {err && <div style={{ color: 'crimson', marginBottom: 12 }}>{err}</div>}
        <button type="submit" style={{ padding: '8px 14px' }}>Sign In</button>
      </form>
      <div style={{ marginTop: 12 }}>
        No account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
