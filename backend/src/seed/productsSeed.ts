import Product from "../models/Product.model";

export async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;

  await Product.insertMany([
    {
      name: "T-shirt",
      price: 29.99,
      imageUrl: "https://picsum.photos/seed/tshirt/600/400",
      description: "Basic tee",
    },
    {
      name: "Hoodie",
      price: 59.99,
      imageUrl: "https://picsum.photos/seed/hoodie/600/400",
      description: "Warm hoodie",
    },
    {
      name: "Sneakers",
      price: 89.99,
      imageUrl: "https://picsum.photos/seed/sneakers/600/400",
      description: "Comfortable sneakers",
    },
  ]);
}

export async function seedProductsForce() {
  await Product.deleteMany({});
  await Product.insertMany([
    {
      name: "T-shirt",
      price: 29.99,
      imageUrl: "https://picsum.photos/seed/tshirt/600/400",
      description: "Basic tee",
    },
    {
      name: "Hoodie",
      price: 59.99,
      imageUrl: "https://picsum.photos/seed/hoodie/600/400",
      description: "Warm hoodie",
    },
    {
      name: "Sneakers",
      price: 89.99,
      imageUrl: "https://picsum.photos/seed/sneakers/600/400",
      description: "Comfortable sneakers",
    },
  ]);
}
