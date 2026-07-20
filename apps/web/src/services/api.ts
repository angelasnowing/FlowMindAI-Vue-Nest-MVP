import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

export function getApiErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return "请求失败，请稍后重试";
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join("；");
  return message || "服务暂时不可用，请稍后重试";
}
