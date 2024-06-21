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
const fetchWorkableData_1 = __importDefault(require("./fetchWorkableData"));
const post_to_slack_1 = require("../../components/utils/post-to-slack");
//find the name of the business
function getWorkableCompanyName(url) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
//get the job listings from the API
function getWorkableData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const companyName = yield getWorkableCompanyName(url);
        if (!companyName) {
            console.error("Invalid company name");
            return null;
        }
        const workableJobData = yield (0, fetchWorkableData_1.default)(companyName);
        if (!workableJobData) {
            console.error("Could not fetch job data from Workable API");
            return null;
        }
        const applyLink = "https://apply.workable.com/";
        const jobData = workableJobData.map((job, index) => {
            var _a;
            return (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (job.shortcode
                ? { applyLink: applyLink + companyName + "/j/" + job.shortcode }
                : {})), (job.title ? { title: job.title } : {})), (job.workplace ? { workStyle: job.workplace } : {})), (job.type ? { workType: job.type } : {})), (((_a = job.location) === null || _a === void 0 ? void 0 : _a.city) ? { locations: job.location.city } : {})), (job.department ? { areas: job.department } : {})), (job.description
                ? {
                    description: job.requirements
                        ? `${job.description} ${job.requirements}`
                        : job.description,
                }
                : {})));
        });
        yield (0, post_to_slack_1.reportScraperOutput)(url, jobData.length);
        return jobData;
    });
}
exports.default = getWorkableData;
