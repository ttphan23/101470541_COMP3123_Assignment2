// src/api/employees.js
import { api } from './client';

// LIST ALL
export const getEmployees = async () => {
  const { data } = await api.get('/emp/employees');
  return data;
};

// SEARCH (department / position)
export const searchEmployees = async ({ department, position }) => {
  const params = {};
  if (department) params.department = department;
  if (position) params.position = position;
  const { data } = await api.get('/emp/employees/search', { params });
  return data;
};

// GET BY ID
export const getEmployee = async (id) => {
  const { data } = await api.get(`/emp/employees/${id}`);
  return data;
};

// CREATE (multipart, supports file)
export const createEmployee = async (payload) => {
  // payload can be { first_name, last_name, email, position, salary, date_of_joining, department, profile_image (File) }
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      fd.append(k, v);
    }
  });
  const { data } = await api.post('/emp/employees', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// UPDATE (multipart, optional new image)
export const updateEmployee = async (id, payload) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      fd.append(k, v);
    }
  });
  const { data } = await api.put(`/emp/employees/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// DELETE (path param, not ?eid=)
export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/emp/employees/${id}`);
  return data;
};
