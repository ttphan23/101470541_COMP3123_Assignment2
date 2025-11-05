import client from './client';

export const login = (data) => client.post('/api/v1/user/login', data);
export const signup = (data) => client.post('/api/v1/user/signup', data);
