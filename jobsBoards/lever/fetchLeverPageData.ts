import { Job } from "../job.interface";

async function addDescription(jobs: Job[], browser: any): Promise<Job[]> {
  console.log("Adding description");
  for (const job of jobs) {
    console.log(`Merging job ${jobs.indexOf(job) + 1} of ${jobs.length}`);
    const jobLandingPage = await browser.newPage();
    await jobLandingPage.goto(job.applyLink);
  
    job.description = await jobLandingPage.evaluate(() => {
      const jobDescription = document.querySelector(
        ".content > div:nth-child(2)"
      ); // Select the second div inside the .content class
      return jobDescription ? jobDescription.innerHTML : null; // Return the inner HTML content of the div if it exists, otherwise null
    });
  
    await jobLandingPage.close();
  }
  return jobs;
}

// Get the job listings from the API
async function fetchLeverPageData(browser: any, companyName: string): Promise<Job[] | null> {
  const url = "https://jobs.lever.co/" + companyName;
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector(".posting");

  const jobs: Job[] = await page.$$eval(".postings-group .posting", (postings: Element[]) =>
    postings.map((posting) => {
      const areasElement = posting
        .closest(".postings-group")
        ?.querySelector(".large-category-label") as HTMLElement | null;
      const workTypeElement = posting.querySelector(
        ".posting-categories .sort-by-commitment"
      ) as HTMLElement | null;
      const titleElement = posting.querySelector(
        ".posting-title h5[data-qa='posting-name']"
      ) as HTMLElement | null;
      const locationElement = posting.querySelector(
        ".posting-title .posting-categories .sort-by-location"
      ) as HTMLElement | null;
      const workStyleElement = posting.querySelector(
        ".posting-categories .workplaceTypes"
      ) as HTMLElement | null;
      const jobURLElement = posting.querySelector(".posting .posting-title") as HTMLElement | null;

      // Spread the object if the data is available
      return {
        ...(jobURLElement && { applyLink: (jobURLElement as HTMLAnchorElement).href }),
        ...(titleElement && { title: titleElement.innerText }),
        ...(locationElement && { locations: [locationElement.innerText] }),
        ...(areasElement && { areas: [areasElement.innerText] }),
        ...(workTypeElement && { workType: [workTypeElement.innerText] }),
        ...(workStyleElement && { workStyle: [workStyleElement.innerText] }),
      };
    })
  );
  
  // Open job links and add the description inside the jobs list
  const updatedJobs = await addDescription(jobs, browser);

  return updatedJobs;
}

export default fetchLeverPageData;
