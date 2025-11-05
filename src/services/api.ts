const BASE_URL = 'https://api-dpvtech.onrender.com/api';

async function request(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) {
  const headers = { 'Content-Type': 'application/json' };
  const config: RequestInit = { method, headers };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Ocorreu um erro na requisição.');
    }

    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || (contentLength !== null && parseInt(contentLength) === 0)) {
        return Promise.resolve();
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  login: (email: string, senha: string) => request('/auth/login', 'POST', { email, senha }),
  register: (usuario: { nome: string; email: string; senha: string; }) => request('/auth/register', 'POST', usuario),
  
  createVehicle: (veiculo: any) => request('/veiculos', 'POST', veiculo),
  getVehicles: () => request('/veiculos', 'GET'),
  searchVehicle: (query: string) => request(`/veiculos/search?query=${encodeURIComponent(query)}`, 'GET'),
  deleteVehicle: (id: number) => request(`/veiculos/${id}`, 'DELETE'),

  createLocation: (localizacao: any) => request('/localizacoes', 'POST', localizacao),
  searchLocation: (loc: { armazem: string; rua: string; modulo: string; compartimento: string; }) => {
    const params = new URLSearchParams(loc).toString();
    return request(`/localizacoes/search?${params}`, 'GET');
  },
  deleteLocation: (id: number) => request(`/localizacoes/${id}`, 'DELETE'),

  createHistory: (veiculoId: number, localizacaoId: number) => request('/historico', 'POST', { veiculoId, localizacaoId }),
  getHistory: () => request('/historico', 'GET'),
  deleteHistoryItem: (id: number) => request(`/historico/${id}`, 'DELETE'),
  clearHistory: () => request('/historico/all', 'DELETE'),

  updateHistoryLocation: (id: number, novaLocalizacao: { armazem: string; rua: string; modulo: string; compartimento: string; }) =>
    request(`/historico/${id}/localizacao`, 'PUT', novaLocalizacao),
};
