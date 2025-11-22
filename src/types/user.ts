export interface UserUpdatePayload {
  fullname: string;
  birth_date: string;
}

export interface UserData {
  id: string;
  fullname: string;
  email: string;
  cpf: string;
  birthDate: string;
  complete: boolean;
  roles: string[];
  createdAt: string;
}