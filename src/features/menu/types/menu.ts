export type MenuCategory = {
  id: string;
  label: string;
  icon: string;
};

export type MenuOptionChoice = {
  id: string;
  label: string;
  priceDelta?: number;
};

export type MenuOptionGroup = {
  id: string;
  label: string;
  required?: boolean;
  multiple?: boolean;
  choices: MenuOptionChoice[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  rating: number;
  orderCount: number;
  imageUrl: string;
  popular?: boolean;
  optionGroups?: MenuOptionGroup[];
};
