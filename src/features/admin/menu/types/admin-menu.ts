export type AdminMenuCategory = {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
};

export type AdminMenuOptionChoice = {
  id: string;
  label: string;
  priceDelta: number;
};

export type AdminMenuOptionGroup = {
  id: string;
  label: string;
  required: boolean;
  multiple: boolean;
  choices: AdminMenuOptionChoice[];
};

export type AdminMenuItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  categoryName: string;
  isAvailable: boolean;
  isPopular: boolean;
  optionGroups: AdminMenuOptionGroup[];
};

export type AdminMenuItemInput = {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  isAvailable: boolean;
  isPopular: boolean;
  optionGroups: Array<{
    label: string;
    required: boolean;
    multiple: boolean;
    choices: Array<{
      label: string;
      priceDelta: number;
    }>;
  }>;
};
