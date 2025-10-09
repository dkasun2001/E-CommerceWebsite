const Category = require("../models/Category");

const categories = [
  { _id: "65a7e24602e12c44f599442e", name: "fragrances" },
  { _id: "65a7e24602e12c44f599442f", name: "skincare" },
  { _id: "65a7e24602e12c44f5994433", name: "tops" },
  { _id: "65a7e24602e12c44f5994436", name: "mens-shirts" },
  { _id: "65a7e24602e12c44f5994437", name: "mens-shoes" },
  { _id: "65a7e24602e12c44f5994438", name: "mens-watches" },
  { _id: "65a7e24602e12c44f599443c", name: "sunglasses" },
];

exports.seedCategory = async () => {
  try {
    await Category.insertMany(categories);
    console.log("Category seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
