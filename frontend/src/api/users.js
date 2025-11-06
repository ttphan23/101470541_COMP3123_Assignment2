import { api } from './client';

export const login = (payload) => api.post('/user/login', payload);
export const signup = (payload) => api.post('/user/signup', payload);
