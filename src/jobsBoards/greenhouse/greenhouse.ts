import fetchGreenhouseFromAPI from "./fetchGreenhouseData"
import { reportScraperOutput } from "../../components/utils/post-to-slack";

async function getGreenhouseCompanyName(url: string): Promise<string | null> {
  let companyName = "";
  //if user has provided known greenhouse link
  if (url.includes("https://boards-api.greenhouse.io/v1/boards/")) {
    companyName = url.split("greenhouse.io/v1/boards/")[1].split("/")[0];
  } else if (url.includes("for=")) {
    const match = url.match(/for=([^&]+)/);
    if (!match || !match[1]) {
      console.error("Could not extract company name from URL using 'for='");
      return null;
    }
    companyName = match[1];
  } else if (url.includes("boards.greenhouse.io")) {
    companyName = url.split("boards.greenhouse.io/")[1].split("/")[0];
  } else {
    const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^./]+)(?:\.[^./]+)+/;
    const matches = url.match(domainRegex);
    if (!matches || matches.length < 2) {
      throw new Error("Invalid URL format");
    }
    console.log("Matches found:", matches);
    companyName = matches[1];
  }
  console.log(`Company name found: ${companyName}`);
  return companyName;
}

async function getGreenHouseData(url: string): Promise<any[] | null> {
  const companyName = await getGreenhouseCompanyName(url);
  if (!companyName) {
    console.error("Invalid company name");
    return null;
  }
  const greenhouseJobData = await fetchGreenhouseFromAPI(companyName);
  if (!greenhouseJobData) {
    console.error("Could not fetch job data from Bamboo API");
    return null;
  }
  const jobData = greenhouseJobData.map((job, index) => ({
    ...(job.updated_at ? { createdAt: job.updated_at } : {}),
    ...(job.absolute_url ? { applyLink: job.absolute_url } : {}),
    ...(job.title ? { title: job.title } : {}),
    ...(job.location?.name ? { locations: job.location.name } : {}),
    ...(job.departments?.name ? { areas: job.departments.name } : {}),
    ...(job.content ? { description: job.content } : {}),
  }));

  await reportScraperOutput(url, jobData.length);
  return jobData;
}

export default getGreenHouseData;
