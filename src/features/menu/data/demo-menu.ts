import type { MenuCategory, MenuItem } from "@/features/menu/types/menu";

export const categories: MenuCategory[] = [
  { id: "all", label: "Popular", icon: "🔥" },
  { id: "rice", label: "Rice", icon: "🍚" },
  { id: "noodle", label: "Noodles", icon: "🍜" },
  { id: "snack", label: "Snacks", icon: "🍟" },
  { id: "drink", label: "Drinks", icon: "🥤" },
  { id: "dessert", label: "Dessert", icon: "🍰" }
];

function choiceId(
  itemId: string,
  groupId: string,
  id: string
) {
  return `${itemId}_${groupId}_${id}`;
}

export const menuItems: MenuItem[] = [
  {
    id: "signature-chicken-rice",
    name: "Signature Chicken Rice",
    description: "Tender chicken, fragrant rice and our house-made chilli sauce.",
    price: 12.9,
    categoryId: "rice",
    rating: 4.9,
    orderCount: 128,
    popular: true,
    imageUrl:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    optionGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        choices: [
          {
            id: choiceId("signature-chicken-rice", "size", "regular"),
            label: "Regular"
          },
          {
            id: choiceId("signature-chicken-rice", "size", "large"),
            label: "Large",
            priceDelta: 4
          }
        ]
      },
      {
        id: "spice",
        label: "Spice level",
        required: true,
        choices: [
          {
            id: choiceId("signature-chicken-rice", "spice", "none"),
            label: "No spicy"
          },
          {
            id: choiceId("signature-chicken-rice", "spice", "mild"),
            label: "Mild"
          },
          {
            id: choiceId("signature-chicken-rice", "spice", "medium"),
            label: "Medium"
          },
          {
            id: choiceId("signature-chicken-rice", "spice", "hot"),
            label: "Hot"
          }
        ]
      },
      {
        id: "extras",
        label: "Add-ons",
        multiple: true,
        choices: [
          {
            id: choiceId("signature-chicken-rice", "extras", "egg"),
            label: "Extra egg",
            priceDelta: 2
          },
          {
            id: choiceId("signature-chicken-rice", "extras", "cheese"),
            label: "Cheese",
            priceDelta: 3
          },
          {
            id: choiceId("signature-chicken-rice", "extras", "chicken"),
            label: "Extra chicken",
            priceDelta: 5
          }
        ]
      }
    ]
  },
  {
    id: "creamy-carbonara",
    name: "Creamy Carbonara",
    description: "Parmesan cream, smoked beef, black pepper and silky pasta.",
    price: 18.9,
    categoryId: "noodle",
    rating: 4.8,
    orderCount: 96,
    popular: true,
    imageUrl:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=85",
    optionGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        choices: [
          {
            id: choiceId("creamy-carbonara", "size", "regular"),
            label: "Regular"
          },
          {
            id: choiceId("creamy-carbonara", "size", "large"),
            label: "Large",
            priceDelta: 5
          }
        ]
      },
      {
        id: "extras",
        label: "Add-ons",
        multiple: true,
        choices: [
          {
            id: choiceId("creamy-carbonara", "extras", "mushroom"),
            label: "Mushroom",
            priceDelta: 3
          },
          {
            id: choiceId("creamy-carbonara", "extras", "cheese"),
            label: "Extra parmesan",
            priceDelta: 3.5
          },
          {
            id: choiceId("creamy-carbonara", "extras", "beef"),
            label: "Extra smoked beef",
            priceDelta: 5
          }
        ]
      }
    ]
  },
  {
    id: "crispy-wings",
    name: "Crispy Chicken Wings",
    description: "Golden wings glazed with our sweet and spicy signature sauce.",
    price: 15.9,
    categoryId: "snack",
    rating: 4.7,
    orderCount: 84,
    popular: true,
    imageUrl:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85",
    optionGroups: [
      {
        id: "portion",
        label: "Portion",
        required: true,
        choices: [
          {
            id: choiceId("crispy-wings", "portion", "six"),
            label: "6 pieces"
          },
          {
            id: choiceId("crispy-wings", "portion", "ten"),
            label: "10 pieces",
            priceDelta: 8
          }
        ]
      },
      {
        id: "sauce",
        label: "Sauce",
        required: true,
        choices: [
          {
            id: choiceId("crispy-wings", "sauce", "original"),
            label: "Original"
          },
          {
            id: choiceId("crispy-wings", "sauce", "spicy"),
            label: "Spicy"
          },
          {
            id: choiceId("crispy-wings", "sauce", "honey"),
            label: "Honey garlic"
          }
        ]
      }
    ]
  },
  {
    id: "iced-lemon-tea",
    name: "Iced Lemon Tea",
    description: "Fresh lemon, black tea and a bright citrus finish.",
    price: 6.9,
    categoryId: "drink",
    rating: 4.8,
    orderCount: 72,
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85",
    optionGroups: [
      {
        id: "ice",
        label: "Ice",
        required: true,
        choices: [
          {
            id: choiceId("iced-lemon-tea", "ice", "normal"),
            label: "Normal ice"
          },
          {
            id: choiceId("iced-lemon-tea", "ice", "less"),
            label: "Less ice"
          },
          {
            id: choiceId("iced-lemon-tea", "ice", "none"),
            label: "No ice"
          }
        ]
      },
      {
        id: "sweetness",
        label: "Sweetness",
        required: true,
        choices: [
          {
            id: choiceId("iced-lemon-tea", "sweetness", "100"),
            label: "100%"
          },
          {
            id: choiceId("iced-lemon-tea", "sweetness", "50"),
            label: "50%"
          },
          {
            id: choiceId("iced-lemon-tea", "sweetness", "0"),
            label: "0%"
          }
        ]
      }
    ]
  }
];
