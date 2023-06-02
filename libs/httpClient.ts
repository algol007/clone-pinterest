import Axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
// @ts-ignore
import { ACCESS_KEY, BASE_URL } from '@env';

const token = 123;

export const httpClient = Axios.create({
  baseURL: BASE_URL,
});

export function setAxiosToken(token: string) {
  httpClient.defaults.headers["Authorization"] = `Client-ID ${ACCESS_KEY}`;
}

export function removeAxiosToken() {
  delete httpClient.defaults.headers["Authorization"];
}

export function getDefaultHeaders() {
  return {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  };
}

httpClient.interceptors.request.use((config: any) => {
  if (!config.headers || !token) return config;

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set("Authorization", `Client-ID ${ACCESS_KEY}`);
  } else if (config.headers !== undefined) {
    config.headers["Authorization"] = `Client-ID ${ACCESS_KEY}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Only return response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (
      error instanceof AxiosError &&
      error?.response?.status == 422 &&
      error.response?.data
    ) {
      return Promise.reject(
        new ValidationError(
          error.response?.data as UnprocessableEntityErrorResponsePayload
        )
      );
    }

    return Promise.reject(error);
  }
);

type UnprocessableEntityErrorResponsePayload = {
  errors: Array<{ rule: string; field: string; message: string }>;
};

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
}

type ErrorMap = Record<string, string>;

export class ValidationError extends Error {
  public readonly errors: ErrorMap;
  constructor(payload: UnprocessableEntityErrorResponsePayload) {
    super("Un-processable entity");
    const errors: Record<string, string> = payload.errors.reduce((map, bag) => {
      return { ...map, [bag.field]: bag.message };
    }, {});
    this.errors = errors;
  }
}
