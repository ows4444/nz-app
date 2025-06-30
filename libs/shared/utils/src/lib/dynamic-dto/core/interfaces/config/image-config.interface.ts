export interface ImageConfig {
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  formats?: string[];
  quality?: number;
  generateThumbnails?: boolean;
  thumbnailSizes?: Array<{ width: number; height: number; name: string }>;
}
