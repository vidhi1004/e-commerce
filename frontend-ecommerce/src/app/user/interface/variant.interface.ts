import { Inventory } from "./inventory.interface";

export interface ProductVariantInterface {
  id: number;
  sku: string;
  size: string;
  price: number;
  color: string;
  inventory: Inventory;
}
