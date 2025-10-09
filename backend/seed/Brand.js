const Brand = require("../models/Brand");

const brands = [
  { _id: "65a7e20102e12c44f59943da", name: "Impression of Acqua Di Gio" },
  { _id: "65a7e20102e12c44f59943db", name: "Royal_Mirage" },
  { _id: "65a7e20102e12c44f59943dc", name: "Fog Scent Xpressio" },
  { _id: "65a7e20102e12c44f59943dd", name: "Al Munakh" },
  { _id: "65a7e20102e12c44f59943de", name: "Lord - Al-Rehab" },
  { _id: "65a7e20102e12c44f59943df", name: "L'Oreal Paris" },
  { _id: "65a7e20102e12c44f59943e0", name: "Dermive" },
  { _id: "65a7e20102e12c44f59943e1", name: "ROREC White Rice" },
  { _id: "65a7e20102e12c44f59943e2", name: "Fair & Clear" },
  { _id: "65a7e20102e12c44f59943e3", name: "Hemani Tea" },
  { _id: "65a7e20102e12c44f59943e4", name: "Top Sweater" },
  { _id: "65a7e20102e12c44f59943e5", name: "Professional Wear" },
  { _id: "65a7e20102e12c44f59943e6", name: "Soft Cotton" },
  { _id: "65a7e20102e12c44f59943e7", name: "Digital Printed" },
  { _id: "65a7e20102e12c44f59943e8", name: "Ghazi Fabric" },
  { _id: "65a7e20102e12c44f59943e9", name: "Rubber" },
  { _id: "65a7e20102e12c44f59943ea", name: "Sandals Flip Flops" },
  { _id: "65a7e20102e12c44f59943eb", name: "Maasai Sandals" },
  { _id: "65a7e20102e12c44f59943ec", name: "Arrivals Genuine" },
  { _id: "65a7e20102e12c44f59943ed", name: "SKMEI 9117" },
  { _id: "65a7e20102e12c44f59943ee", name: "Strap Skeleton" },
  { _id: "65a7e20102e12c44f59943ef", name: "Stainless" },
  { _id: "65a7e20102e12c44f59943f0", name: "Eastern Watches" },
  { _id: "65a7e20102e12c44f59943f1", name: "Luxury Digital" },
  { _id: "65a7e20102e12c44f59943f2", name: "mastar watch" },
  { _id: "65a7e20102e12c44f59943f3", name: "Designer Sun Glasses" },
  { _id: "65a7e20102e12c44f59943f4", name: "LouisWill" },
  { _id: "65a7e20102e12c44f59943f5", name: "Copenhagen Luxe" },
  { _id: "65a7e20102e12c44f59943f6", name: "Steal Frame" },
  { _id: "65a7e20102e12c44f59943f7", name: "JIEPOLLY" },
  { _id: "65a7e20102e12c44f59943f8", name: "IELGY" },
  { _id: "65a7e20102e12c44f59943f9", name: "IELGY fashion" },
  { _id: "65a7e20102e12c44f59943fa", name: "LouisWill" },
  { _id: "65a7e20102e12c44f59943fb", name: "Copenhagen Luxe" },
];

exports.seedBrand = async () => {
  try {
    await Brand.insertMany(brands);
    console.log('Brand seeded successfully');
  } catch (error) {
    console.log(error);
  }
};
