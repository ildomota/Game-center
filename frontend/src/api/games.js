import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getGames = (params) => api.get('/games', { params }).then((r) => r.data)
export const getGame = (slug) => api.get(`/games/${slug}`).then((r) => r.data)
