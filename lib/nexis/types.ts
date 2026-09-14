export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder?: number;
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  category?: Category | null;
  name: string;
  slug: string;
  shortDescription: string;
  description?: string | null;
  startingPrice: number;
  currency: string;
  advancePercentage: number;
  estimatedDelivery: string;
  imageUrl?: string | null;
  isFeatured: boolean;
  isEnabled: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category?: string;
  summary: string;
  description?: string;
  tags: string[];
  imageUrl?: string | null;
  liveUrl?: string | null;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface KnykCatalogResponse {
  services: Service[];
  categories?: Category[];
}
