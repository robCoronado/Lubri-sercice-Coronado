import { PRODUCT_TYPES } from '../data/masterData';

export const generateSKU = (category: string, brand: string, type: string): string => {
  const prefix = 'LWC - ';
  const categoryCode = category.substring(0, 2).toUpperCase();
  const brandCode = brand.substring(0, 2).toUpperCase();
  const typeCode = type.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
  
  return `${prefix}${categoryCode}${brandCode}${typeCode}`;
};

export const generateProductName = (brand: string, type: string): string => {
  return `${brand} ${type}`.trim();
};

export const isOilCategory = (category: string): boolean => {
  return category === 'oil';
};

export const getProductTypesByCategory = (category: string) => {
  return PRODUCT_TYPES[category as keyof typeof PRODUCT_TYPES]?.types || [];
};