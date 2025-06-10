import axios, { type AxiosInstance, type AxiosResponse } from "axios";

const getToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem("fwtoken");
    return token;
  } catch (error) {
    return null;
  }
};

class Api {
  private client: AxiosInstance | null = null;
  private api_url: string;

  constructor() {
    this.api_url =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api"
        : "http://localhost:5000/api";
  }

  init = (type?: string): AxiosInstance => {
    let headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (type === "multipart/form-data") {
      headers = {
        "Content-Type": "multipart/form-data",
      };
    }

    this.client = axios.create({
      baseURL: this.api_url,
      timeout: 31000,
      headers,
    });

    this.client.interceptors.request.use(
      async (config: import("axios").InternalAxiosRequestConfig) => {
        const token = await getToken();
        if (token) {
          if (config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return this.client;
  };

  //authentication 

    register = (body: Record<string, any>): Promise<AxiosResponse> => {
       return this.init().post("/auth/register", body);
    };

    login = (body: Record<string, any>): Promise<AxiosResponse> => {
        return this.init().post("/auth/login", body);
    };

    users = (): Promise<AxiosResponse> => {
        return this.init().get(`/notes/get/users`);
    };

    // Note CRUD

  getNoteById = (id: string): Promise<AxiosResponse> => {
    return this.init().get(`/notes/${id}`);
  };

    getAllNotes = (queryParams: string): Promise<AxiosResponse> => {
        return this.init().get(`/notes?${queryParams}`);
    };

    createNote = (body: Record<string, any>): Promise<AxiosResponse> => {
        return this.init().post(`/notes/create`, body);
    };
    updateNote = (id: string, body: Record<string, any>): Promise<AxiosResponse> => {
        return this.init().put(`/notes/update/${id}`, body);
    };
    deleteNote = (id: string): Promise<AxiosResponse> => {
        return this.init().delete(`/notes/delete/${id}`);
    };
}

const api = new Api();
export default api;
