import type { ImageRecord, UploadResponse, DeleteResponse } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function uploadImage(file: File, token: string): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  return request<UploadResponse>("/api/images", token, {
    method: "POST",
    body: form,
  });
}

export async function listImages(token: string): Promise<ImageRecord[]> {
  return request<ImageRecord[]>("/api/images", token);
}

export async function deleteImage(id: string, token: string): Promise<DeleteResponse> {
  return request<DeleteResponse>(`/api/images/${id}`, token, { method: "DELETE" });
}
