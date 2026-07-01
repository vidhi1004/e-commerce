import { CategoryInterface } from "./category.interface";
import { ImageInterface } from "./image.interface";
import { ProductVariantInterface } from "./variant.interface";

export interface ProductInterface {
  id: number;
  name: string;
  description: string;
  brand: string;
  category: CategoryInterface;
  images: ImageInterface[];
  variants: ProductVariantInterface[];
}
