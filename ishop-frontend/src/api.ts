const API_URL = 'http://localhost:3000';

export interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  category?: string;
};

export async function login(email:string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    });

    if(!response.ok) {
        const errorData = await response.json().catch(()=>null);
        const message = errorData?.message || 'Ошибка авторизации';
        throw new Error(message)
    }

    const data = await response.json();

    return data;

}

export async function getProducts(): Promise<Product[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Нет токена, нужно заново войти");
  }

  const response = await fetch(`${API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Ожидали JSON, сервер вернул:", text);
    throw new Error("Сервер вернул не JSON при загрузке товаров");
  }

  if (!response.ok) {
    const text = await response.text();
    console.error("Ошибка загрузки товаров:", response.status, text);
    throw new Error(`Ошибка загрузки списка товаров: ${response.status}`);
  }

  return response.json();
}