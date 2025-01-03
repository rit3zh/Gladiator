import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export default class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });
  }

  async request<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance({
        url,
        method,
        data,
        ...config,
      });
      return response.data;
    } catch (error: any) {
      console.error("Request failed:", error.message);
      throw error;
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, "GET", undefined, config);
  }

  post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, "POST", data, config);
  }

  put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, "PUT", data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(url, "DELETE", undefined, config);
  }
}
