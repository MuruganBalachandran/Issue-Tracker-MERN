import api from "@/lib/api";

export interface User {
  _id: string;
  Name: string;
  Email: string;
  Role: string;
}

export const getProfile = async (): Promise<User> => {
  const res = await api.get("/users/profile");
  console.log(res.data.user)
  return res.data.user;
};

export const login = async (Email: string, Password: string): Promise<User> => {
  const res = await api.post("/users/login", { Email, Password });
  return res.data.user;
};

export const signup = async (Name: string, Email: string, Password: string): Promise<User> => {
  const res = await api.post("/users/signup", { Name, Email, Password });
  return res.data.user;
};


export const logout = async (): Promise<void> => {
  await api.post("/users/logout");
};
