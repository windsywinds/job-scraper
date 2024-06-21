import fetchWorkableFromAPI from "./fetchWorkableData"
import { reportScraperOutput } from "../../components/utils/post-to-slack";

//find the name of the business
async function getWorkableCompanyName(url: string): Promise<string | null>  {
  console.log("Extracting company name from url:", url);


  // Extract the company name after '.com/'
  const match = url.match(/\.com\/([^\/]+)/);
  if (!match || !match[1]) {
    console.error("Could not extract company name from URL");
    return null;
  }
  const companyName = match[1];
  console.log(companyName);
  return companyName;
}

//get the job listings from the API
async function getWorkableData(url: string): Promise<any[] | null> {
  const companyName = await getWorkableCompanyName(url);
  if (!companyName) {
    console.error("Invalid company name");
    return null;
  }

  const workableJobData = await fetchWorkableFromAPI(companyName);
  if (!workableJobData) {
    console.error("Could not fetch job data from Workable API");
    return null;
  }
  const applyLink = "https://apply.workable.com/";

  const jobData = workableJobData.map((job, index) => ({
    ...(job.shortcode
      ? { applyLink: applyLink + companyName + "/j/" + job.shortcode }
      : {}),
    ...(job.title ? { title: job.title } : {}),
    ...(job.workplace ? { workStyle: job.workplace } : {}),
    ...(job.type ? { workType: job.type } : {}),
    ...(job.location?.city ? { locations: job.location.city } : {}),
    ...(job.department ? { areas: job.department } : {}),
    ...(job.description
      ? {
          description: job.requirements
            ? `${job.description} ${job.requirements}`
            : job.description,
        }
      : {}),
  }));
  await reportScraperOutput(url, jobData.length);
  return jobData;
}

export default getWorkableData;
