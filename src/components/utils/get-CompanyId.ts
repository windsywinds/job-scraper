import prisma from "./prisma-client";

async function getCompanyId(url: string): Promise<string | null> {
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
}

export default getCompanyId;
