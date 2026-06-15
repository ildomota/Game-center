import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getGames = (params) => api.get('/games', { params }).then((r) => r.data)
export const getGame = (slug) => api.get(`/games/${slug}`).then((r) => r.data)
export const getGamePricing = (slug) => api.get(`/pricing/${slug}`).then((r) => r.data)
export const getPlayerCount = (slug) => api.get(`/steam/${slug}/players`).then((r) => r.data)
export const getGameNews = (slug) => api.get(`/steam/${slug}/news`).then((r) => r.data)
export const getGameTrailers = (slug) => api.get(`/steam/${slug}/trailers`).then((r) => r.data)
