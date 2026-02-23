export interface ImageRecord {
  id: string;
  userId: string;
  processedUrl: string;
  createdAt: string;
}

export interface UploadResponse {
  id: string;
  processedUrl: string;
  createdAt: string;
}

export interface DeleteResponse {
  ok: true;
}
