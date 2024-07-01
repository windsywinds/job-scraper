const { reportError } = require("./post-to-slack");
import prisma from "./prisma-client";

async function removeJobBoard(url: string): Promise<void | null> {
  try {
    const companyJobBoard = await prisma.company.findFirst({
      where: { jobBoardUrl: url },
    });

    if (companyJobBoard) {
      await prisma.company.update({
        where: { id: companyJobBoard.id },
        data: { jobBoardUrl: { unset: true } },
      });

      await reportError(url);
      console.log("jobBoardUrl removed for company:", companyJobBoard.name);
    } else {
      console.log("Company board not found for URL:", url);
      return null;
    }
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default removeJobBoard;
