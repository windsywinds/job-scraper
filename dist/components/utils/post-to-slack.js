"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportDatabaseInsert = exports.reportScraperOutput = exports.reportError = void 0;
function getNewTimeStamp() {
    const date = new Date();
    const options = {
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
function reportScraperOutput(url, jobData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Reporting scraper job via slack...");
        const timestamp = getNewTimeStamp();
        const message = {
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
        yield postToSlack(message);
    });
}
exports.reportScraperOutput = reportScraperOutput;
function reportDatabaseInsert(jobsAdded, removedJobs, updatedJobs, alreadyExistingJobs) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Reporting database insertion via slack...");
        const message = {
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
        yield postToSlack(message);
    });
}
exports.reportDatabaseInsert = reportDatabaseInsert;
function reportError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Reporting job error via slack...");
        const timestamp = getNewTimeStamp();
        const message = {
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
        yield postToSlack(message);
    });
}
exports.reportError = reportError;
function postToSlack(slackMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const reportingEnabled = process.env.DOCKER_ENVIRONMENT === "true";
        if (reportingEnabled) {
            const webHookUrl = process.env.SLACK_WEBHOOK_URL;
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(slackMessage),
            };
            if (webHookUrl) {
                try {
                    const response = yield fetch(webHookUrl, options);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                catch (error) {
                    console.error("Error:", error);
                }
            }
            else {
                console.log("Slack Webhook URL unavailable");
            }
        }
        else {
            console.log("Slack reporting currently disabled");
        }
    });
}
