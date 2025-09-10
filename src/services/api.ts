// services/api.ts
import axios from "axios";

export const get = async (url: string, params?: any) => {
  const res = await axios.get(url, { params });
  return res.data;
};

export const post = async (url: string, data: any) => {
  const res = await axios.post(url, data);
  return res.data;
};
