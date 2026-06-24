import axios from 'axios';

const API_URL = 'https://sistema-controle-celulares.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

//  Adiciona o token em toda requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//  Interceptor de resposta: renova token automaticamente ao receber 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Se já está renovando, enfileira a requisição
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // Sem refresh token, desloga
                logout();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                const { accessToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Função de logout limpa tudo e redireciona
const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('tipo');
    window.location.href = '/login';
};

// ✅ Celular
export const celularService = {
    listarTodos: () => api.get('/celulares'),
    buscarPorImei: (imei) => api.get(`/celulares/${imei}`),
    cadastrar: (celular) => api.post('/celulares', celular),
    atualizar: (imei, celular) => api.put(`/celulares/${imei}`, celular),
    deletar: (imei) => api.delete(`/celulares/${imei}`)
};

// ✅ Colaborador
export const colaboradorService = {
    listarTodos: () => api.get('/colaboradores'),
    buscarPorRegistro: (registro) => api.get(`/colaboradores/${registro}`),
    cadastrar: (colaborador) => api.post('/colaboradores', colaborador),
    atualizar: (registro, colaborador) => api.put(`/colaboradores/${registro}`, colaborador),
    deletar: (registro) => api.delete(`/colaboradores/${registro}`)
};

// ✅ Entrega
export const entregaService = {
    listarTodas: () => api.get('/entregas'),
    buscarPorId: (imei, registro) => api.get(`/entregas/${imei}/${registro}`),
    buscarPorCelular: (imei) => api.get(`/entregas/celular/${imei}`),
    buscarPorColaborador: (registro) => api.get(`/entregas/colaborador/${registro}`),
    cadastrar: (entrega) => api.post('/entregas', entrega),
    atualizar: (imei, registro, entrega) => api.put(`/entregas/${imei}/${registro}`, entrega),
    deletar: (imei, registro) => api.delete(`/entregas/${imei}/${registro}`),
    listarHistorico: () => api.get('/entregas/historico')
};

// ✅ Chip
export const chipService = {
    listarTodos: () => api.get('/chips'),
    buscarPorIccid: (iccid) => api.get(`/chips/${iccid}`),
    cadastrar: (chip) => api.post('/chips', chip),
    atualizar: (iccid, chip) => api.put(`/chips/${iccid}`, chip),
    deletar: (iccid) => api.delete(`/chips/${iccid}`)
};

// ✅ Computador
export const computadorService = {
    listarTodos: () => api.get('/computadores'),
    buscarPorPatrimonio: (patrimonio) => api.get(`/computadores/${patrimonio}`),
    cadastrar: (computador) => api.post('/computadores', computador),
    atualizar: (patrimonio, computador) => api.put(`/computadores/${patrimonio}`, computador),
    deletar: (patrimonio) => api.delete(`/computadores/${patrimonio}`),
    buscarPorStatus: (status) => api.get(`/computadores/status/${status}`)
};

// ✅ Vínculo Chip ↔ Celular
export const vinculoChipService = {
    chipAtualDoCelular: (imei) => api.get(`/vinculos-chip/celular/${imei}/atual`),
    historicoPorCelular: (imei) => api.get(`/vinculos-chip/celular/${imei}`),
    historicoPorChip: (iccid) => api.get(`/vinculos-chip/chip/${iccid}`),
    vincular: (iccid, imei) => api.post('/vinculos-chip', { iccid, imei }),
    desvincular: (imei) => api.delete(`/vinculos-chip/celular/${imei}`)
};

// ✅ Entrega de Computador
export const entregaComputadorService = {
    listarTodas: () => api.get('/entregas-computador'),
    buscarPorId: (id) => api.get(`/entregas-computador/${id}`),
    cadastrar: (entrega) => api.post('/entregas-computador', entrega),
    atualizar: (id, entrega) => api.put(`/entregas-computador/${id}`, entrega),
    deletar: (id) => api.delete(`/entregas-computador/${id}`),
    listarHistorico: () => api.get('/entregas-computador/historico')
};


// ✅ Passagem
export const passagemService = {
    listarTodas: () => api.get('/passagens'),
    buscarPorId: (id) => api.get(`/passagens/${id}`),
    buscarPorColaborador: (registro) => api.get(`/passagens/colaborador/${registro}`),
    listarPendentes: () => api.get('/passagens/pendentes'),                              // ✅ novo
    aprovar: (id) => api.patch(`/passagens/${id}/aprovar`),                              // ✅ novo
    rejeitar: (id, observacao) => api.patch(`/passagens/${id}/rejeitar`, { observacao }), // ✅ novo
    cadastrar: (passagem) => api.post('/passagens', passagem),
    atualizar: (id, passagem) => api.put(`/passagens/${id}`, passagem),
    deletar: (id) => api.delete(`/passagens/${id}`)
};

// ✅ Hotel
export const hotelService = {
    listarTodas: () => api.get('/hoteis'),
    buscarPorId: (id) => api.get(`/hoteis/${id}`),
    buscarPorColaborador: (registro) => api.get(`/hoteis/colaborador/${registro}`),
    listarPendentes: () => api.get('/hoteis/pendentes'),                                 // ✅ novo
    aprovar: (id) => api.patch(`/hoteis/${id}/aprovar`),                                 // ✅ novo
    rejeitar: (id, observacao) => api.patch(`/hoteis/${id}/rejeitar`, { observacao }),   // ✅ novo
    cadastrar: (hotel) => api.post('/hoteis', hotel),
    atualizar: (id, hotel) => api.put(`/hoteis/${id}`, hotel),
    deletar: (id) => api.delete(`/hoteis/${id}`)
};

export default api;