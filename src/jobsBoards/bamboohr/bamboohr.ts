import fetchBambooFromAPI from "./fetchBambooData";
import { reportScraperOutput } from "../../components/utils/post-to-slack";

//find the name of the business
async function getBambooCompanyName(url: string): Promise<string | null> {
  const match = url.match(/https:\/\/([^\.]+)\.bamboohr\.com/);
  if (match && match.length > 1) {
    const companyName = match[1];
    console.log(`Found company name: ${companyName}, in url: ${url}`);
    return companyName;
  } else {
    console.error("Company name not found, invalid URL:", url);
    return null;
  }
}

//get the job listings from the API
async function getBambooData(url: string): Promise<any[] | null> {
  //get data using api
  const companyName = await getBambooCompanyName(url);
  if (!companyName) {
    console.error("Invalid company name");
    return null;
  }
  const bambooJobData = await fetchBambooFromAPI(companyName);
  if (!bambooJobData) {
    console.error("Could not fetch job data from Bamboo API");
    return null;
  }
  const applyLink = `https://${companyName}.bamboohr.com/careers/`;

  // Upload JSON data for all jobs related to the URL given
  const jobData = bambooJobData.map((job, index) => ({
    status: job.result.jobOpening?.jobOpeningStatus
      ? job.result.jobOpening.jobOpeningStatus
      : "",
    ...(job.id ? { applyLink: applyLink + job.id } : {}),
    ...(job.result.jobOpening?.jobOpeningName
      ? { title: job.result.jobOpening.jobOpeningName }
      : {}),
    ...(job.result.jobOpening?.locationType === "0"
      ? { workStyle: "On Site" }
      : job.result.jobOpening?.locationType === "1"
        ? { workStyle: "Remote" }
        : job.result.jobOpening?.locationType === "2"
          ? { workStyle: "Hybrid" }
          : {}),
    ...(job.result.jobOpening?.employmentStatusLabel
      ? { workType: job.result.jobOpening.employmentStatusLabel }
      : {}),
    ...(job.result.jobOpening?.minimumExperience
      ? { seniority: job.result.jobOpening.minimumExperience }
      : {}),
    ...(job.result.jobOpening?.location?.city
      ? { locations: job.result.jobOpening.location.city }
      : {}),
    ...(job.result.jobOpening?.departmentLabel
      ? { areas: job.result.jobOpening?.departmentLabel }
      : {}),
    ...(job.result.jobOpening?.description
      ? { description: job.result.jobOpening?.description }
      : {}),
  }));

  await reportScraperOutput(url, jobData.length);
  return jobData;
}

export default getBambooData;
