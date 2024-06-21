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
const fetchGreenhouseData_1 = __importDefault(require("./fetchGreenhouseData"));
const post_to_slack_1 = require("../../components/utils/post-to-slack");
function getGreenhouseCompanyName(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let companyName = "";
        //if user has provided known greenhouse link
        if (url.includes("https://boards-api.greenhouse.io/v1/boards/")) {
            companyName = url.split("greenhouse.io/v1/boards/")[1].split("/")[0];
        }
        else if (url.includes("for=")) {
            const match = url.match(/for=([^&]+)/);
            if (!match || !match[1]) {
                console.error("Could not extract company name from URL using 'for='");
                return null;
            }
            companyName = match[1];
        }
        else if (url.includes("boards.greenhouse.io")) {
            companyName = url.split("boards.greenhouse.io/")[1].split("/")[0];
        }
        else {
            const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^./]+)(?:\.[^./]+)+/;
            const matches = url.match(domainRegex);
            if (!matches || matches.length < 2) {
                throw new Error("Invalid URL format");
            }
            console.log("Matches found:", matches);
            companyName = matches[1];
        }
        console.log(`Company name found: ${companyName}`);
        return companyName;
    });
}
function getGreenHouseData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const companyName = yield getGreenhouseCompanyName(url);
        if (!companyName) {
            console.error("Invalid company name");
            return null;
        }
        const greenhouseJobData = yield (0, fetchGreenhouseData_1.default)(companyName);
        if (!greenhouseJobData) {
            console.error("Could not fetch job data from Bamboo API");
            return null;
        }
        const jobData = greenhouseJobData.map((job, index) => {
            var _a, _b;
            return (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (job.updated_at ? { createdAt: job.updated_at } : {})), (job.absolute_url ? { applyLink: job.absolute_url } : {})), (job.title ? { title: job.title } : {})), (((_a = job.location) === null || _a === void 0 ? void 0 : _a.name) ? { locations: job.location.name } : {})), (((_b = job.departments) === null || _b === void 0 ? void 0 : _b.name) ? { areas: job.departments.name } : {})), (job.content ? { description: job.content } : {})));
        });
        yield (0, post_to_slack_1.reportScraperOutput)(url, jobData.length);
        return jobData;
    });
}
exports.default = getGreenHouseData;
