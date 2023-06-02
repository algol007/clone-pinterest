import { httpClient } from "../libs/httpClient"

const photoService = {
  getAllPhotos() {
    return httpClient.get('/photos')
  }
}

export default photoService;