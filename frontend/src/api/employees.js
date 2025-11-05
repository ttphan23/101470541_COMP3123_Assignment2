import client from './client';

export const getEmployees = () =>
  client.get('/api/v1/emp/employees').then(r => r.data);

export const searchEmployees = (params) =>
  client.get('/api/v1/emp/employees/search', { params }).then(r => r.data);

export const getEmployee = (id) =>
  client.get(`/api/v1/emp/employees/${id}`).then(r => r.data);

export const deleteEmployee = (id) =>
  client.delete(`/api/v1/emp/employees/${id}`).then(r => r.data);

export const createEmployee = (values) => {
  const form = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });
  return client.post('/api/v1/emp/employees', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);
};

export const updateEmployee = (id, values) => {
  const isFile = values.profile_image instanceof File;
  if (isFile) {
    const form = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, v);
    });
    return client.put(`/api/v1/emp/employees/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  }
  return client.put(`/api/v1/emp/employees/${id}`, values).then(r => r.data);
};
