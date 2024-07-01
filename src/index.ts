import prisma from "./components/utils/prisma-client";
import getWorkableData from "./jobsBoards/workable/workable";
import getLeverJobsData from "./jobsBoards/lever/lever";
import getMyRecruitmentJobData from "./jobsBoards/myrecruitmentplus/myrecruitmentplus";
import getGreenHouseData from "./jobsBoards/greenhouse/greenhouse";
import getBambooData from "./jobsBoards/bamboohr/bamboohr";
import getSwagappData from "./jobsBoards/swagapp/swagapp";
import findJobBoardFromUrl from "./jobsBoards/findJobPlatform";
import initBrowser from "./components/utils/new-browser";
import finaliseDataEntry from "./components/index";
import { reportError } from "./components/utils/post-to-slack";

async function main(urls: string[]): Promise<void> {
  console.log(`Passed in urls: ${urls}`);

  if (!urls || urls.length === 0) {
    throw new Error(`No url found`);
  }

  console.log("Data retrieval started");
  const browser = await initBrowser();
  try {
    for (const url of urls) {
      let jobData: any[] = [];
      if (url === null) {
        console.log("jobBoardUrl is NULL");
      } else if (url.includes("workable.com")) {
        jobData = (await getWorkableData(url)) || [];
      } else if (url.includes("jobs.lever.co")) {
        jobData = (await getLeverJobsData(browser, url)) || [];
      } else if (url.includes("greenhouse.io")) {
        jobData = (await getGreenHouseData(url)) || [];
      } else if (url.includes("myrecruitmentplus")) {
        jobData = (await getMyRecruitmentJobData(browser, url)) || [];
      } else if (url.includes("bamboo")) {
        jobData = (await getBambooData(url)) || [];
      } else if (url.includes("swagapp")) {
        jobData = (await getSwagappData(url)) || [];
      } else {
        console.log("Unknown job board");
        const retrievedJobData = await findJobBoardFromUrl(browser, url);
        if (!retrievedJobData) {
          console.log("Job board unsupported");
        }
        jobData = retrievedJobData || [];
      }

      console.log("Data retrieval complete");

      const inputJobData = Array.isArray(jobData) ? jobData : [];

      if (inputJobData.length > 0) {
        await finaliseDataEntry(inputJobData, url);
      } else {
        console.error("Invalid job data: jobData is missing or empty.");
      }
    }
  } catch (error) {
    await browser.close();
    console.error("Error fetching or saving data:", error);
    await reportError(error);
    throw error;
  } finally {
    await browser.close();
    console.log("Job complete!");
  }
}

async function getJobUrls(): Promise<string[]> {
  try {
    if (process.argv.slice(2).length === 0) {
      const companies = await prisma.company.findMany({
        select: { jobBoardUrl: true },
      });
      if (companies.length === 0) {
        console.log("No job URLs found in the database.");
        return [];
      }
      return companies.map((company) => company.jobBoardUrl).filter((url): url is string => url !== null);
    } else {
      return process.argv.slice(2);
    }
  } catch (error) {
    console.error("Error fetching job URLs:", error);
    await reportError(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  const jobUrls = await getJobUrls();
  await main(jobUrls);
})();
