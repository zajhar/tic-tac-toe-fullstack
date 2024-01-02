import axios, { AxiosInstance } from "axios";

class Api {
  public baseUrl: string;
  protected suffix: string = "";
  protected headers: object;

  constructor(url: string | undefined) {
    this.baseUrl = `${url}/api`;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  public latest(): AxiosInstance {
    const apiLatest = axios.create({
      baseURL: `${this.baseUrl}/${this.suffix}`,
      withCredentials: true,
    });

    return apiLatest;
  }
}

const apiLatest = new Api(import.meta.env.VITE_BE_URL).latest();
export default apiLatest;
