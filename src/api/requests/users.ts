import { api } from "../serverConnections/api";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  birthDate?: string;
  image?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: {
    color: string;
    type: string;
  };
  domain?: string;
  ip?: string;
  address?: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    postalCode: string;
    state: string;
  };
  macAddress?: string;
  university?: string;
  bank?: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company?: {
    address?: {
      address: string;
      city: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
      postalCode: string;
      state: string;
    };
    department: string;
    name: string;
    title: string;
  };
  ein?: string;
  ssn?: string;
  userAgent?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  age?: number;
}

// GET: Tüm kullanıcıları getir
export const fetchAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/users");
  return data.users || data; // DummyJSON users array'i içinde döner
};

// GET: Belirli bir kullanıcının detaylarını getir
export const fetchUserById = async (userId: number): Promise<User> => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

// POST: Yeni kullanıcı oluştur
export const createUser = async (
  userData: CreateUserData
): Promise<User> => {
  const { data } = await api.post("/users/add", userData);
  return data;
};

