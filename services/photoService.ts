import { httpClient } from "../libs/httpClient"

export type PhotoParams = {
  per_page: number
  query?: string
}

const photoService = {
  getAllPhotos(params: PhotoParams) {
    return httpClient.get('/photos', { params })
  },
  getRandomPhotos() {
    return httpClient.get('/photos/random?count=30')
  },
  getSearchPhotos(params: PhotoParams) {
    return httpClient.get('/search/photos', { params })
  },
  getPhotoDetail(id: string) {
    return httpClient.get(`/photos/${id}`)
  }
}

export default photoService;