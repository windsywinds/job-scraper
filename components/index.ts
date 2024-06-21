import checkAndUpdateJob from "./checkAndUpdateJob";
import dataRationaliser from "./rationaliseData";
import { reportDatabaseInsert } from "./utils/post-to-slack";
import getCompanyId from "./utils/get-CompanyId";
import { PrismaClient, Job } from "@prisma/client";

const prisma = new PrismaClient();

async function finaliseDataEntry(inputJobData: any[], url: string): Promise<void> {
  let jobsAdded = 0;
  let updatedJobs = 0;
  let alreadyExistingJobs = 0;
  let discardedJob = 0;
  const companyId = await getCompanyId(url);

  try {
    // Loop through inputJobData and create records for each item
    for (const job of inputJobData) {
      // rationalise data
      console.log(
        `Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} is getting itself RATIONALISED`
      );
      const rationalisedData = await dataRationaliser(job) as Partial<Job>;


      // Ensure rationalisedData contains necessary fields for database operations
      if (rationalisedData && rationalisedData.applyLink) {
        rationalisedData.companyId = companyId || undefined;

        console.log("Rationalisation complete, attempting to add to DB...");

        // Type assertion to ensure all required properties are present
        if (rationalisedData) {
          const eachjob = await checkAndUpdateJob(rationalisedData as Job);
          if (eachjob) {
            if (eachjob === "Job Update") {
              console.log(
                `Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length}, has been updated in the database.`
              );
              updatedJobs++;
            } else {
              console.log(
                `Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} is already in the database.`
              );
              alreadyExistingJobs++;
            }
          } else {
            const currentDate = new Date();
            const isoDateString = currentDate.toISOString();
            rationalisedData.createdAt = isoDateString;

            await prisma.job.create({
              data: rationalisedData as Omit<Job, "id">, // Ensure the data matches JobCreateInput without id
            });
            console.log(
              `Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} has been added to the database: ${job.title ? job.title : ""}`
            );
            jobsAdded++;
          }
        } else {
          console.log("Job listing was discarded due to missing required fields");
          discardedJob++;
        }
      } else {
        console.log("Job listing was discarded due to missing applyLink");
        discardedJob++;
      }
    }
  } catch (err) {
    console.error("ERROR with rationalisation or database functions:", err);
  } finally {
    // calculate the number of jobs that were not added to the database for reporting
    const removedJobs =
      inputJobData.length - jobsAdded - updatedJobs - alreadyExistingJobs;
    await reportDatabaseInsert(
      jobsAdded,
      removedJobs,
      updatedJobs,
      alreadyExistingJobs
    );
  }
}

export default finaliseDataEntry
