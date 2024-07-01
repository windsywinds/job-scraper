import fetchMyRecruitmentData from "./fetchMyRecruitmentData"
import { reportScraperOutput } from "../../components/utils/post-to-slack";
import { Browser } from "puppeteer";

async function getMyRecruitmentJobData(browser: Browser, url: string): Promise<any[] | null> {
  const jobData = await fetchMyRecruitmentData(browser, url);
  if (!jobData) {
    console.error("Could not fetch job data from Lever page");
    return null;
  }
  await reportScraperOutput(url, jobData.length);
  return jobData;
}

export default getMyRecruitmentJobData;
