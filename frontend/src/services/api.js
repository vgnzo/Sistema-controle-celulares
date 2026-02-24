import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL, 
    headers: {
        'Content-Type': 'application/json'
    }
});


//celular 
export const celularService = {
    listarTodos: () => api.get('/celulares'),
    buscarPorImei: (imei) => api.get(`/celulares/${imei}`),
    cadastrar: (celular) => api.post('/celulares', celular),
    atualizar: (imei, celular) => api.put(`/celulares/${imei}`, celular),
    deletar: (imei) => api.delete(`/celulares/${imei}`)
};


//colaborador 

export const colaboradorService = {
  listarTodos: () => api.get('/colaboradores'),
  buscarPorRegistro: (registro) => api.get(`/colaboradores/${registro}`),
  cadastrar: (colaborador) => api.post('/colaboradores', colaborador),
  atualizar: (registro, colaborador) => api.put(`/colaboradores/${registro}`, colaborador),
  deletar: (registro) => api.delete(`/colaboradores/${registro}`)
};


//entrega 

export const entregaService = {
  listarTodas: () => api.get('/entregas'),
  buscarPorId: (imei, registro) => api.get(`/entregas/${imei}/${registro}`),
  buscarPorCelular: (imei) => api.get(`/entregas/celular/${imei}`),
  buscarPorColaborador: (registro) => api.get(`/entregas/colaborador/${registro}`),
  cadastrar: (entrega) => api.post('/entregas', entrega),
  atualizar: (imei, registro, entrega) => api.put(`/entregas/${imei}/${registro}`, entrega),
  deletar: (imei, registro) => api.delete(`/entregas/${imei}/${registro}`)
};

export default api;

