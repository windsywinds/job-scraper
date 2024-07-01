import { SlackMessage } from "../../types/interfaces";

function getNewTimeStamp(): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Pacific/Auckland",
  };
  
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);
  const formattedDate = parts.map((part) => part.value).join("").replace(/,/g, "");
  return formattedDate;
}


async function reportScraperOutput(url: string, jobData: number) {
    console.log("Reporting scraper job via slack...");
    const timestamp = getNewTimeStamp();
    const message: SlackMessage = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*New scraping job completed ${timestamp}*:`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `- Job board URL: ${url} :globe_with_meridians:\n- Number of jobs scraped: ${jobData} :books:`,
          },
        },
      ],
    };
    await postToSlack(message);
  }
  

async function reportDatabaseInsert(
    jobsAdded: number,
    removedJobs: number,
    updatedJobs: number,
    alreadyExistingJobs: number
  ) {
  console.log("Reporting database insertion via slack...");
  const message: SlackMessage = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Database report:*`,
        },
      },
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_list",
            style: "bullet",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: `Job listings added to the database: `,
                    style: { bold: true },
                  },
                  {
                    type: "text",
                    text: `${jobsAdded} `,
                  },
                  {
                    type: "emoji",
                    name: "heavy_check_mark",
                  },
                ],
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: `Job listings updated in the database: `,
                    style: { bold: true },
                  },
                  {
                    type: "text",
                    text: `${updatedJobs} `,
                  },
                  {
                    type: "emoji",
                    name: "heavy_check_mark",
                  },
                ],
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: `Jobs already in the database: `,
                    style: { bold: true },
                  },
                  {
                    type: "text",
                    text: `${alreadyExistingJobs} `,
                  },
                  {
                    type: "emoji",
                    name: "x",
                  },
                ],
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: `Other jobs scraped but removed: `,
                    style: { bold: true },
                  },
                  {
                    type: "text",
                    text: `${removedJobs} `,
                  },
                  {
                    type: "emoji",
                    name: "x",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  await postToSlack(message);
}

async function reportError(error: any) {
  console.log("Reporting job error via slack...");
  const timestamp = getNewTimeStamp();
  const message: SlackMessage = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${timestamp} error with job scraper:*`,
        },
      },
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_list",
            style: "bullet",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "emoji",
                    name: "x",
                  },
                  {
                    type: "emoji",
                    name: "warning",
                  },
                ],
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: `Details: `,
                  },
                ],
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: `${error.message}`,
                  },
                ],
              },
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "emoji",
                    name: "x",
                  },
                  {
                    type: "emoji",
                    name: "warning",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  await postToSlack(message);
}

async function postToSlack(slackMessage: SlackMessage) {
  const reportingEnabled = process.env.DOCKER_ENVIRONMENT === "true";
  if (reportingEnabled) {
    const webHookUrl = process.env.SLACK_WEBHOOK_URL
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackMessage),
    };

    if (webHookUrl) {
      try {
        const response = await fetch(webHookUrl, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log("Slack Webhook URL unavailable")
    }
  } else {
    console.log("Slack reporting currently disabled");
  }
}

export { reportError, reportScraperOutput, reportDatabaseInsert };
