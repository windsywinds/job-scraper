import { Job } from "./job.interface";

const removeJobBoard = require("../components/utils/delete-JobBoardUrl");
const getGreenHouseData = require("./greenhouse/greenhouse");
const keywords = [
  "greenhouse.io",
  "lever.co",
  "workable.com",
  "swagapp",
  "myrecruitmentplus",
  "bamboohr",
];

//this function will search the page html if no network request is identified
const checkHtml = async (page: any):  Promise<string | null> => {
  const html = await page.evaluate(() => {
    return document.documentElement.outerHTML;
  });
  const keyword = keywords.find((keyword) =>
    html.toLowerCase().includes(keyword.toLowerCase())
  );
  if (keyword) {
    console.log(`KEYWORD MATCH "${keyword}" found on the page`);
    return keyword;
  } else {
    console.log(`No keywords found on the page`);
    return null;
  }
};

async function searchForJobBoardType(browser: any, url: string): Promise<{ confirmedUrl: string, boardType: string }> {
  const page = await browser.newPage();
  const fetchedUrls = [];
  let confirmedUrl = url;
  let boardType = "Unknown";

  page.on("response", (response: any) => {
    const apiUrl = response.url();
    fetchedUrls.push(apiUrl);

    if (
      apiUrl.includes("embed/job_board/js?for=") ||
      apiUrl.includes("https://boards-api.greenhouse.io/v1/boards/")
    ) {
      boardType = "greenhouse.io";
      confirmedUrl = apiUrl;
      page.removeAllListeners("response");
    } else if (fetchedUrls.length > 100) {
      console.log(
        `Page has exceeded ${fetchedUrls.length} requests with no results. Ending monitoring.`
      );
      page.removeAllListeners("response");
    }
  });

  try {
    await page.goto(url);
    console.log(
      "No board type found in network requests, checking html for keywords"
    );
    const keyword = await checkHtml(page);
    if (keyword) {
      boardType = keyword;
    }
  } catch (err) {
    console.log(err);
  }

  return { confirmedUrl, boardType };
}

async function findJobBoardFromUrl(browser: any, url: string): Promise<Job[]> {
  let confirmedUrl = url;
  const jobBoardPlatform = await searchForJobBoardType(browser, url);

  const boardType = jobBoardPlatform.boardType;
  confirmedUrl = jobBoardPlatform.confirmedUrl;

  let jobData = [];

  if (boardType && boardType !== "Unknown") {
    if (boardType.includes("greenhouse.io")) {
      jobData = await getGreenHouseData(confirmedUrl);
    }
    // add more board conditions here as found
  } else {
    await removeJobBoard(url);
  }

  return jobData;
}

export default findJobBoardFromUrl;
