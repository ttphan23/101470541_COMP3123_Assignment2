import React, { useState } from 'react';
import { isEmail, required, positiveNumber } from '../utils/validate';

export default function EmployeeForm({ initial = {}, onSubmit, submitLabel = 'Create' }) {
  const [form, setForm] = useState({
    first_name: initial.first_name || '',
    last_name: initial.last_name || '',
    email: initial.email || '',
    position: initial.position || '',
    salary: initial.salary ?? '',
    date_of_joining: initial.date_of_joining ? initial.date_of_joining.substring(0,10) : '',
    department: initial.department || '',
    profile_image: null
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onFile = (e) => setForm({ ...form, profile_image: e.target.files[0] });

  const validate = () => {
    const e = {};
    if (!required(form.first_name)) e.first_name = 'First name is required';
    if (!required(form.last_name)) e.last_name = 'Last name is required';
    if (!isEmail(form.email)) e.email = 'Valid email is required';
    if (!required(form.position)) e.position = 'Position is required';
    if (!positiveNumber(form.salary)) e.salary = 'Salary must be a positive number';
    if (!required(form.department)) e.department = 'Department is required';
    if (!required(form.date_of_joining)) e.date_of_joining = 'Join date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      setBusy(true);
      await onSubmit({
        ...form,
        date_of_joining: new Date(form.date_of_joining).toISOString(),
      });
    } catch (err) {
      setServerError('Save failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert alert-danger">{serverError}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">First name</label>
          <input className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} name="first_name" value={form.first_name} onChange={onChange}/>
          {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Last name</label>
          <input className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} name="last_name" value={form.last_name} onChange={onChange}/>
          {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={form.email} onChange={onChange}/>
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Position</label>
          <input className={`form-control ${errors.position ? 'is-invalid' : ''}`} name="position" value={form.position} onChange={onChange}/>
          {errors.position && <div className="invalid-feedback">{errors.position}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label">Salary</label>
          <input className={`form-control ${errors.salary ? 'is-invalid' : ''}`} name="salary" value={form.salary} onChange={onChange}/>
          {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label">Date of Joining</label>
          <input type="date" className={`form-control ${errors.date_of_joining ? 'is-invalid' : ''}`} name="date_of_joining" value={form.date_of_joining} onChange={onChange}/>
          {errors.date_of_joining && <div className="invalid-feedback">{errors.date_of_joining}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label">Department</label>
          <input className={`form-control ${errors.department ? 'is-invalid' : ''}`} name="department" value={form.department} onChange={onChange}/>
          {errors.department && <div className="invalid-feedback">{errors.department}</div>}
        </div>
        <div className="col-12">
          <label className="form-label">Profile Image (optional)</label>
          <input type="file" className="form-control" name="profile_image" onChange={onFile} accept="image/*"/>
        </div>
      </div>

      <button disabled={busy} className="btn btn-primary mt-3">
        {busy ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
