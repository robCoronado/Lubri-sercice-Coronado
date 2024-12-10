// Master data for product form
export const BRANDS = [
  { id: 'mobil', name: 'Mobil' },
  { id: 'shell', name: 'Shell' },
  { id: 'castrol', name: 'Castrol' },
  { id: 'valvoline', name: 'Valvoline' },
  { id: 'pennzoil', name: 'Pennzoil' },
  { id: 'total', name: 'Total' },
];

export const PRODUCT_TYPES = {
  oil: {
    name: 'Oil',
    types: [
      { id: '5w30', name: '5W-30' },
      { id: '5w40', name: '5W-40' },
      { id: '10w30', name: '10W-30' },
      { id: '10w40', name: '10W-40' },
      { id: '15w40', name: '15W-40' },
      { id: '20w50', name: '20W-50' },
    ],
  },
  filters: {
    name: 'Filters',
    types: [
      { id: 'oil_filter', name: 'Oil Filter' },
      { id: 'air_filter', name: 'Air Filter' },
      { id: 'fuel_filter', name: 'Fuel Filter' },
      { id: 'cabin_filter', name: 'Cabin Filter' },
    ],
  },
  accessories: {
    name: 'Accessories',
    types: [
      { id: 'wipers', name: 'Wipers' },
      { id: 'bulbs', name: 'Bulbs' },
      { id: 'batteries', name: 'Batteries' },
    ],
  },
  cleaning: {
    name: 'Cleaning Supplies',
    types: [
      { id: 'car_wash', name: 'Car Wash' },
      { id: 'polish', name: 'Polish' },
      { id: 'wax', name: 'Wax' },
    ],
  },
} as const;

export type ProductCategory = keyof typeof PRODUCT_TYPES;

export const CATEGORIES = Object.entries(PRODUCT_TYPES).map(([id, data]) => ({
  id,
  name: data.name,
}));