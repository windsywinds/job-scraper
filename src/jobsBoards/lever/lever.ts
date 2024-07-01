import fetchLeverPageData from "./fetchLeverPageData"
import { reportScraperOutput } from "../../components/utils/post-to-slack";
import { Browser } from "puppeteer";

async function getLeverCompanyName(url: string): Promise<string | null> {
  const match = url.match(/jobs\.lever\.co\/([^/]+)/);
  if (match && match.length > 1) {
    const companyName = match[1];
    console.log(`Found company name: ${companyName}, in url: ${url}`);
    return companyName;
  } else {
    console.error("Company name not found, invalid URL:", url);
    return null;
  }

}

//get the job listings
async function getLeverJobsData(browser: Browser, url: string): Promise<any[] | null> {
  console.log(`Using Lever URL: ${url}`);
  const companyName = await getLeverCompanyName(url);
  if (!companyName) {
    console.error("Invalid company name");
    return null;
  }
  console.log(`Using Lever URL: ${companyName}`);
  const jobData = await fetchLeverPageData(browser, companyName);
  if (!jobData) {
    console.error("Could not fetch job data from Lever page");
    return null;
  }

  await reportScraperOutput(url, jobData.length);
  return jobData;
}

export default getLeverJobsData;
