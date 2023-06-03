import { httpClient } from "../libs/httpClient"

export type PhotoParams = {
  per_page: number
}

export type RandomPhotoParams = {
  count: number
}

const photoService = {
  getAllPhotos(params: PhotoParams) {
    return httpClient.get('/photos', { params })
  },
  getRandomPhotos(params: RandomPhotoParams) {
    return httpClient.get('/photos/random', { params })
  },
  getPhotoDetail(id: string) {
    return httpClient.get(`/photos/${id}`)
  }
}

export default photoService;