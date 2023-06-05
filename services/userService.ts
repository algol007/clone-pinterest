import { httpClient } from "../libs/httpClient"

const userService = {
  getCurrentUser() {
    return httpClient.get('/users/hyundaimotorgroup')
  },
}

export default userService;