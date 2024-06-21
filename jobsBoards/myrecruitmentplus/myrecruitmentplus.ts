import fetchMyRecruitmentData from "./fetchMyRecruitmentData"
import { reportScraperOutput } from "../../components/utils/post-to-slack";

async function getMyRecruitmentJobData(browser: any, url: string): Promise<any[] | null> {
  const jobData = await fetchMyRecruitmentData(browser, url);
  if (!jobData) {
    console.error("Could not fetch job data from Lever page");
    return null;
  }
  await reportScraperOutput(url, jobData.length);
  return jobData;
}

export default getMyRecruitmentJobData;
