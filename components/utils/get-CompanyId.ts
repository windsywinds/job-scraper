import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getCompanyId(url: string): Promise<string | null> {
  const isNotLocalDatabase = process.env.DOCKER_ENVIRONMENT === "true";
  if (isNotLocalDatabase) {
    try {
      const companyData = await prisma.company.findFirst({
        where: { jobBoardUrl: url },
      });
  
      if (companyData) {
        return companyData.id;
      } else {
        console.log("Company not found for URL:", url);
        return null;
      }
    } catch (err) {
      console.error("Error fetching company data:", err);
      return null;
    } finally {
      await prisma.$disconnect();
    }
  } else {
    console.log("Company ID set to '12345' for local testing");
    return '12345'
  }
}

export default getCompanyId;
