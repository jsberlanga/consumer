const BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

export interface Response<T> {
  results: T[];
  success: boolean;
  error: null | {
    message: string;
    code: number;
  };
}

export class APIGateway {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async get(path: string) {
    return fetch(`${this.baseUrl}/${path}`).then((res) => res.json());
  }

  public async getVisitors() {
    return this.get('visitors');
  }
}

export default new APIGateway(BASE_URL);
