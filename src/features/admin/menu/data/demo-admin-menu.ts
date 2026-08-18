import type {
  AdminMenuCategory,
  AdminMenuItem
} from "@/features/admin/menu/types/admin-menu";

export const demoAdminMenuCategories: AdminMenuCategory[] = [
  { id: "category_rice", name: "Rice", slug: "rice", itemCount: 1 },
  { id: "category_noodle", name: "Noodles", slug: "noodle", itemCount: 1 },
  { id: "category_snack", name: "Snacks", slug: "snack", itemCount: 1 },
  { id: "category_drink", name: "Drinks", slug: "drink", itemCount: 1 },
  { id: "category_dessert", name: "Dessert", slug: "dessert", itemCount: 0 }
];

export const demoAdminMenuItems: AdminMenuItem[] = [
  {
    id: "signature-chicken-rice",
    name: "Signature Chicken Rice",
    description: "Tender chicken, fragrant rice and our house-made chilli sauce.",
    imageUrl:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    price: 12.9,
    categoryId: "category_rice",
    categoryName: "Rice",
    isAvailable: true,
    isPopular: true,
    optionGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        multiple: false,
        choices: [
          { id: "regular", label: "Regular", priceDelta: 0 },
          { id: "large", label: "Large", priceDelta: 4 }
        ]
      },
      {
        id: "spice",
        label: "Spice level",
        required: true,
        multiple: false,
        choices: [
          { id: "none", label: "No spicy", priceDelta: 0 },
          { id: "mild", label: "Mild", priceDelta: 0 },
          { id: "medium", label: "Medium", priceDelta: 0 },
          { id: "hot", label: "Hot", priceDelta: 0 }
        ]
      }
    ]
  },
  {
    id: "creamy-carbonara",
    name: "Creamy Carbonara",
    description: "Parmesan cream, smoked beef, black pepper and silky pasta.",
    imageUrl:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=85",
    price: 18.9,
    categoryId: "category_noodle",
    categoryName: "Noodles",
    isAvailable: true,
    isPopular: true,
    optionGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        multiple: false,
        choices: [
          { id: "regular", label: "Regular", priceDelta: 0 },
          { id: "large", label: "Large", priceDelta: 5 }
        ]
      }
    ]
  },
  {
    id: "crispy-wings",
    name: "Crispy Chicken Wings",
    description: "Golden wings glazed with our sweet and spicy signature sauce.",
    imageUrl:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85",
    price: 15.9,
    categoryId: "category_snack",
    categoryName: "Snacks",
    isAvailable: true,
    isPopular: true,
    optionGroups: [
      {
        id: "portion",
        label: "Portion",
        required: true,
        multiple: false,
        choices: [
          { id: "six", label: "6 pieces", priceDelta: 0 },
          { id: "ten", label: "10 pieces", priceDelta: 8 }
        ]
      }
    ]
  },
  {
    id: "iced-lemon-tea",
    name: "Iced Lemon Tea",
    description: "Fresh lemon, black tea and a bright citrus finish.",
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85",
    price: 6.9,
    categoryId: "category_drink",
    categoryName: "Drinks",
    isAvailable: true,
    isPopular: false,
    optionGroups: [
      {
        id: "ice",
        label: "Ice",
        required: true,
        multiple: false,
        choices: [
          { id: "normal", label: "Normal ice", priceDelta: 0 },
          { id: "less", label: "Less ice", priceDelta: 0 },
          { id: "none", label: "No ice", priceDelta: 0 }
        ]
      }
    ]
  }
];
