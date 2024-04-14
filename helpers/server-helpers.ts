import prisma from "@/prisma";

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
  }catch(err){
    console.error(err);
    
    throw new Error("Failed to connect to database");
  }
};