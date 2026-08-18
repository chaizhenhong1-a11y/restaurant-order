import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

const adapter = new PrismaPg({
  connectionString
});

const prisma = new PrismaClient({
  adapter
});

const restaurantId = "restaurant_mellow_kitchen";

const categories = [
  { id: "category_rice", name: "Rice", slug: "rice", sortOrder: 10 },
  { id: "category_noodle", name: "Noodles", slug: "noodle", sortOrder: 20 },
  { id: "category_snack", name: "Snacks", slug: "snack", sortOrder: 30 },
  { id: "category_drink", name: "Drinks", slug: "drink", sortOrder: 40 },
  { id: "category_dessert", name: "Dessert", slug: "dessert", sortOrder: 50 }
];

async function seedMenuItem(input: {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  isPopular: boolean;
  optionGroups: Array<{
    id: string;
    label: string;
    required?: boolean;
    multiple?: boolean;
    choices: Array<{
      id: string;
      label: string;
      priceDelta?: number;
    }>;
  }>;
}) {
  await prisma.menuItem.upsert({
    where: {
      id: input.id
    },
    update: {
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      price: input.price,
      categoryId: input.categoryId,
      restaurantId,
      isPopular: input.isPopular,
      isAvailable: true
    },
    create: {
      id: input.id,
      name: input.name,
      description: input.description,
      imageUrl: input.imageUrl,
      price: input.price,
      categoryId: input.categoryId,
      restaurantId,
      isPopular: input.isPopular,
      isAvailable: true
    }
  });

  await prisma.menuOptionGroup.deleteMany({
    where: {
      menuItemId: input.id
    }
  });

  for (const [groupIndex, group] of input.optionGroups.entries()) {
    await prisma.menuOptionGroup.create({
      data: {
        id: `${input.id}_${group.id}`,
        label: group.label,
        required: group.required ?? false,
        multiple: group.multiple ?? false,
        sortOrder: groupIndex,
        menuItemId: input.id,
        choices: {
          create: group.choices.map((choice, choiceIndex) => ({
            id: `${input.id}_${group.id}_${choice.id}`,
            label: choice.label,
            priceDelta: choice.priceDelta ?? 0,
            sortOrder: choiceIndex
          }))
        }
      }
    });
  }
}

async function main() {
  await prisma.restaurant.upsert({
    where: {
      slug: "mellow-kitchen"
    },
    update: {
      name: "Mellow Kitchen",
      currency: "MYR",
      isOpen: true
    },
    create: {
      id: restaurantId,
      slug: "mellow-kitchen",
      name: "Mellow Kitchen",
      currency: "MYR",
      isOpen: true
    }
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        id: category.id
      },
      update: {
        ...category,
        restaurantId
      },
      create: {
        ...category,
        restaurantId
      }
    });
  }

  const tables = [
    "A01",
    "A02",
    "A03",
    "A04",
    "A05",
    "B01",
    "B02",
    "B03",
    "B04",
    "B05",
    "B08"
  ];

  for (const code of tables) {
    await prisma.diningTable.upsert({
      where: {
        restaurantId_code: {
          restaurantId,
          code
        }
      },
      update: {
        status: "AVAILABLE"
      },
      create: {
        code,
        status: "AVAILABLE",
        restaurantId
      }
    });
  }

  await seedMenuItem({
    id: "signature-chicken-rice",
    name: "Signature Chicken Rice",
    description: "Tender chicken, fragrant rice and our house-made chilli sauce.",
    imageUrl:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    price: 12.9,
    categoryId: "category_rice",
    isPopular: true,
    optionGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        choices: [
          { id: "regular", label: "Regular" },
          { id: "large", label: "Large", priceDelta: 4 }
        ]
      },
      {
        id: "spice",
        label: "Spice level",
        required: true,
        choices: [
          { id: "none", label: "No spicy" },
          { id: "mild", label: "Mild" },
          { id: "medium", label: "Medium" },
          { id: "hot", label: "Hot" }
        ]
      },
      {
        id: "extras",
        label: "Add-ons",
        multiple: true,
        choices: [
          { id: "egg", label: "Extra egg", priceDelta: 2 },
          { id: "cheese", label: "Cheese", priceDelta: 3 },
          { id: "chicken", label: "Extra chicken", priceDelta: 5 }
        ]
      }
    ]
  });

  await seedMenuItem({
    id: "creamy-carbonara",
    name: "Creamy Carbonara",
    description: "Parmesan cream, smoked beef, black pepper and silky pasta.",
    imageUrl:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=85",
    price: 18.9,
    categoryId: "category_noodle",
    isPopular: true,
    optionGroups: [
      {
        id: "size",
        label: "Size",
        required: true,
        choices: [
          { id: "regular", label: "Regular" },
          { id: "large", label: "Large", priceDelta: 5 }
        ]
      },
      {
        id: "extras",
        label: "Add-ons",
        multiple: true,
        choices: [
          { id: "mushroom", label: "Mushroom", priceDelta: 3 },
          { id: "cheese", label: "Extra parmesan", priceDelta: 3.5 },
          { id: "beef", label: "Extra smoked beef", priceDelta: 5 }
        ]
      }
    ]
  });

  await seedMenuItem({
    id: "crispy-wings",
    name: "Crispy Chicken Wings",
    description: "Golden wings glazed with our sweet and spicy signature sauce.",
    imageUrl:
      "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85",
    price: 15.9,
    categoryId: "category_snack",
    isPopular: true,
    optionGroups: [
      {
        id: "portion",
        label: "Portion",
        required: true,
        choices: [
          { id: "six", label: "6 pieces" },
          { id: "ten", label: "10 pieces", priceDelta: 8 }
        ]
      },
      {
        id: "sauce",
        label: "Sauce",
        required: true,
        choices: [
          { id: "original", label: "Original" },
          { id: "spicy", label: "Spicy" },
          { id: "honey", label: "Honey garlic" }
        ]
      }
    ]
  });

  await seedMenuItem({
    id: "iced-lemon-tea",
    name: "Iced Lemon Tea",
    description: "Fresh lemon, black tea and a bright citrus finish.",
    imageUrl:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85",
    price: 6.9,
    categoryId: "category_drink",
    isPopular: false,
    optionGroups: [
      {
        id: "ice",
        label: "Ice",
        required: true,
        choices: [
          { id: "normal", label: "Normal ice" },
          { id: "less", label: "Less ice" },
          { id: "none", label: "No ice" }
        ]
      },
      {
        id: "sweetness",
        label: "Sweetness",
        required: true,
        choices: [
          { id: "100", label: "100%" },
          { id: "50", label: "50%" },
          { id: "0", label: "0%" }
        ]
      }
    ]
  });

  console.log("Seed complete: Mellow Kitchen, menu and tables are ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
