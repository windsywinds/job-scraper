import fetchSwagappData from "./fetchSwagappData"
import { reportScraperOutput } from "../../components/utils/post-to-slack";

async function getCompanyName(url: string): Promise<string | null> {
    const match = url.match(/\/organisations\/([^/]+)/);
    if (!match || !match[1]) {
      console.error("Could not extract company name from URL");
      return null;
    }
    const companyName = match[1];
    return companyName;
}

async function getSwagappData(url: string): Promise<any[] | null> {
  const companyName = await getCompanyName(url);
  if (!companyName) {
    console.error("Invalid company name");
    return null;
  }
  const swagJobData = await fetchSwagappData(companyName);
  if (!swagJobData) {
    console.error("Could not fetch job data from Bamboo API");
    return null;
  }

  const jobData = swagJobData.map((job, index) => ({
    ...(job.id ? { applyLink: `https://jobs.swagapp.com/jobs/${job.id}` } : {}),
    ...(job.title ? { title: job.title } : {}),
    ...(job.workplace_type ? { workStyle: job.workplace_type } : {}),
    ...(job.employment_type_name ? { workType: job.employment_type_name } : {}),
    ...(job.experience_level_name
      ? { seniority: job.experience_level_name }
      : {}),
    ...(job.vendor_location_name
      ? { locations: job.vendor_location_name }
      : {}),
    ...(job.description ? { description: job.description } : {}),
  }));
  await reportScraperOutput(url, jobData.length);
  return jobData;
}

export default getSwagappData;
