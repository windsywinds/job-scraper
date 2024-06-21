import { Job } from "../job.interface";

async function fetchMyRecruitmentData(browser: any, url: string): Promise<Job[]> {
    const page = await browser.newPage();

  console.log(`Navigating to ${url}`);
  await page.goto(url);

  // Wait for the job listings to load
  await page.waitForSelector(`[class="adlogic_job_results"]`);
  const jobs: Job[] = await page.$$eval(`[class="position"]`, async (elements: Element[]) => {
    console.log("Number of elements found:", elements.length);
    const jobsData: Job[] = [];

    for (const e of elements) {
      // MyRecruitMentPlus has an empty entry at the end of their page which is likely used for adding a new job
      // this if statement will filter it out from the collected data
      const applyLinkElement = e.querySelector('h2 a') as HTMLAnchorElement | null;
      if (applyLinkElement && applyLinkElement.getAttribute('href') !== '{job_link}') {
        const locationElements = e.querySelectorAll('.ajb_location li');
        const locationArray = Array.from(locationElements).map(li => (li as HTMLElement).innerText);
        const jobData: Job = {
          applyLink: applyLinkElement.getAttribute('href') || '',
          title: (e.querySelector('h2') as HTMLElement)?.innerText || '',
          workType: '',
          locations: locationArray.length ? locationArray : [''],
          areas: [(e.querySelector('.ajb_classification') as HTMLElement)?.innerText || ''],
          description: '',
        };

        jobsData.push(jobData);
      }
    }

    return jobsData;
  });

  // Visit each job posting page to extract the description and workType
  for (const job of jobs) {
    const jobPage = await browser.newPage();
    await jobPage.goto(job.applyLink);
    console.log("Navigating to job page", jobs.indexOf(job) + 1, "of", jobs.length, ":", job.applyLink);

    // Add to the job entry data
    try {
      await jobPage.waitForSelector('[id="jobTemplateTitleId"]', { timeout: 5000 });
      job.description = await jobPage.$eval('[id="jobTemplateBodyContainerId"]', (element: HTMLElement) => element.innerText);
      job.workType = await jobPage.$eval('#adlogic_job_details_job_info :nth-child(3)', (element: HTMLElement) => element.innerText.split(', '));
    } catch (error) {
      console.error(`Error extracting description for job ${job.title}:`, (error as Error).message);
      // Use empty string if the elements do not exist
      job.description = '';
      job.workType = '';
    }

    await jobPage.close();
  }

  return jobs;
}

export default fetchMyRecruitmentData;