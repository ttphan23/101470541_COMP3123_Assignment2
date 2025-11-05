import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmployee, getEmployee, updateEmployee } from '../api/employees';

export default function EmployeeForm({ edit }) {
  const nav = useNavigate();
  const { id } = useParams();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    salary: '',
    date_of_joining: '',
    department: '',
    profile_image: null
  });

  const { data: existing } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployee(id),
    enabled: !!edit && !!id
  });

  useEffect(() => {
    if (existing && edit) {
      setForm({
        first_name: existing.first_name || '',
        last_name: existing.last_name || '',
        email: existing.email || '',
        position: existing.position || '',
        salary: existing.salary ?? '',
        date_of_joining: existing.date_of_joining ? existing.date_of_joining.substring(0,10) : '',
        department: existing.department || '',
        profile_image: null
      });
    }
  }, [existing, edit]);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (edit) return updateEmployee(id, form);
      return createEmployee(form);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] });
      qc.invalidateQueries({ queryKey: ['employees', 'search'] });
      nav('/employees');
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div style={{ maxWidth: 720, margin: '28px auto', fontFamily: 'system-ui' }}>
      <h2>{edit ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={onSubmit}>
        <div style={row}>
          <label style={label}>First Name</label>
          <input name="first_name" value={form.first_name} onChange={onChange} required style={input}/>
        </div>
        <div style={row}>
          <label style={label}>Last Name</label>
          <input name="last_name" value={form.last_name} onChange={onChange} required style={input}/>
        </div>
        <div style={row}>
          <label style={label}>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required style={input}/>
        </div>
        <div style={row}>
          <label style={label}>Position</label>
          <input name="position" value={form.position} onChange={onChange} required style={input}/>
        </div>
        <div style={row}>
          <label style={label}>Salary</label>
          <input name="salary" value={form.salary} onChange={onChange} required style={input}/>
        </div>
        <div style={row}>
          <label style={label}>Date of Joining</label>
          <input name="date_of_joining" type="date" value={form.date_of_joining} onChange={onChange} required style={input}/>
        </div>
        <div style={row}>
          <label style={label}>Department</label>
          <input name="department" value={form.department} onChange={onChange} required style={input}/>
        </div>
        <div style={row}>
          <label style={label}>Profile Image</label>
          <input name="profile_image" type="file" accept="image/*" onChange={onChange} style={{ padding: 6 }}/>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" style={{ marginRight: 10 }} disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Saving…' : (edit ? 'Update' : 'Create')}
          </button>
          <button type="button" onClick={() => nav('/employees')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

const row = { display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, marginBottom: 12, alignItems: 'center' };
const label = { fontWeight: 600 };
const input = { padding: 8 };
