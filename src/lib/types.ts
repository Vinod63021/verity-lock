export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Product {
  id: string;
  name:string;
  description: string;
  imageUrl: string;
}

export interface MismatchFindingResult {
  mismatchFound: boolean;
  mismatchedVideoUrl?: string;
  mismatchedProductName?: string;
  report: string;
  videoDetails?: {
    title: string;
    channelName: string;
    viewCount: number;
    publishDate: string;
    videoLength: string;
    thumbnailUrl: string;
    summary: string;
  };
}
