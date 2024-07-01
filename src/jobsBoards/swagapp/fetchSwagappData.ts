import { Job } from "../../types/interfaces";

async function multipleJobPage(pages: number, organizationName: string): Promise<Job[] > {
    const jobsWithMultiplePages: Job[] = [];
  try {
    for (let i = 1; i <= pages; i++) {
      const response = await fetch(
        `https://services.employmenthero.com/ats/api/v1/career_page/organisations/${organizationName}/jobs?item_per_page=10&page_index=${i}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const output = await response.json();
      jobsWithMultiplePages.push(...output.data.items); // Concatenate job data from each page
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching job details:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
  return jobsWithMultiplePages; 
  }
  
  async function fetchSwagappData(companyName: string): Promise<Job[] | null> {
    const jobEndpoint = `https://services.employmenthero.com/ats/api/v1/career_page/organisations/${companyName}/jobs?item_per_page=10&page_index=1`;
  
    try {
      const response = await fetch(jobEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const job = data;
      const jobPages = await job.data.total_pages; //get the total pages of jobs
  
      if (jobPages === 1) {
        return job.data.items; // Return items from the first page
      } else {
        const allData = await multipleJobPage(jobPages, companyName);
        return allData;
      }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching jobs:", error.message);
          } else {
            console.error("Unexpected error:", error);
          }
          return null
    }
  }
  
  export default fetchSwagappData;
  