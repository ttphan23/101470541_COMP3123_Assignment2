import { api } from './client';

// LIST ALL
export const getEmployees = async () => {
  const { data } = await api.get('/emp/employees');
  return data;
};

// SEARCH
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

// CREATE
export const createEmployee = async (payload) => {
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

// UPDATE
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

// DELETE
export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/emp/employees/${id}`);
  return data;
};
