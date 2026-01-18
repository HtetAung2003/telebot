import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getPackages = () => api.get('/packages');
export const createPackage = (data) => api.post('/packages', data);
export const updatePackage = (id, data) => api.put(`/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/packages/${id}`);

export const createForm = (data) => api.post('/forms', data);
export const updateForm = (id, data) => api.put(`/forms/${id}`, data);
export const deleteForm = (id) => api.delete(`/forms/${id}`);

export const createButton = (data) => api.post('/buttons', data);
export const updateButton = (id, data) => api.put(`/buttons/${id}`, data);
export const deleteButton = (id) => api.delete(`/buttons/${id}`);

export default api;
