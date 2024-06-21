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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const workable_1 = __importDefault(require("./jobsBoards/workable/workable"));
const lever_1 = __importDefault(require("./jobsBoards/lever/lever"));
const myrecruitmentplus_1 = __importDefault(require("./jobsBoards/myrecruitmentplus/myrecruitmentplus"));
const greenhouse_1 = __importDefault(require("./jobsBoards/greenhouse/greenhouse"));
const bamboohr_1 = __importDefault(require("./jobsBoards/bamboohr/bamboohr"));
const swagapp_1 = __importDefault(require("./jobsBoards/swagapp/swagapp"));
const findJobPlatform_1 = __importDefault(require("./jobsBoards/findJobPlatform"));
const new_browser_1 = __importDefault(require("./components/utils/new-browser"));
const index_1 = __importDefault(require("./components/index"));
const post_to_slack_1 = require("./components/utils/post-to-slack");
const prisma = new client_1.PrismaClient();
function main(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Passed in urls: ${urls}`);
        if (!urls || urls.length === 0) {
            throw new Error(`No url found`);
        }
        console.log("Data retrieval started");
        const browser = yield (0, new_browser_1.default)();
        try {
            for (const url of urls) {
                let jobData = [];
                if (url === null) {
                    console.log("jobBoardUrl is NULL");
                }
                else if (url.includes("workable.com")) {
                    jobData = (yield (0, workable_1.default)(url)) || [];
                }
                else if (url.includes("jobs.lever.co")) {
                    jobData = (yield (0, lever_1.default)(browser, url)) || [];
                }
                else if (url.includes("greenhouse.io")) {
                    jobData = (yield (0, greenhouse_1.default)(url)) || [];
                }
                else if (url.includes("myrecruitmentplus")) {
                    jobData = (yield (0, myrecruitmentplus_1.default)(browser, url)) || [];
                }
                else if (url.includes("bamboo")) {
                    jobData = (yield (0, bamboohr_1.default)(url)) || [];
                }
                else if (url.includes("swagapp")) {
                    jobData = (yield (0, swagapp_1.default)(url)) || [];
                }
                else {
                    console.log("Unknown job board");
                    const retrievedJobData = yield (0, findJobPlatform_1.default)(browser, url);
                    if (!retrievedJobData) {
                        console.log("Job board unsupported");
                    }
                    jobData = retrievedJobData || [];
                }
                console.log("Data retrieval complete");
                const inputJobData = Array.isArray(jobData) ? jobData : [];
                if (inputJobData.length > 0) {
                    yield (0, index_1.default)(inputJobData, url);
                }
                else {
                    console.error("Invalid job data: jobData is missing or empty.");
                }
            }
        }
        catch (error) {
            yield browser.close();
            console.error("Error fetching or saving data:", error);
            yield (0, post_to_slack_1.reportError)(error);
            throw error;
        }
        finally {
            yield browser.close();
            console.log("Job complete!");
        }
    });
}
function getJobUrls() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.argv.slice(2).length === 0) {
                const companies = yield prisma.company.findMany({
                    select: { jobBoardUrl: true },
                });
                if (companies.length === 0) {
                    console.log("No job URLs found in the database.");
                    return [];
                }
                return companies.map((company) => company.jobBoardUrl).filter((url) => url !== null);
            }
            else {
                return process.argv.slice(2);
            }
        }
        catch (error) {
            console.error("Error fetching job URLs:", error);
            yield (0, post_to_slack_1.reportError)(error);
            throw error;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const jobUrls = yield getJobUrls();
    yield main(jobUrls);
}))();
