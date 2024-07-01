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
const fetchLeverPageData_1 = __importDefault(require("./fetchLeverPageData"));
const post_to_slack_1 = require("../../components/utils/post-to-slack");
function getLeverCompanyName(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = url.match(/jobs\.lever\.co\/([^/]+)/);
        if (match && match.length > 1) {
            const companyName = match[1];
            console.log(`Found company name: ${companyName}, in url: ${url}`);
            return companyName;
        }
        else {
            console.error("Company name not found, invalid URL:", url);
            return null;
        }
    });
}
//get the job listings
function getLeverJobsData(browser, url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Using Lever URL: ${url}`);
        const companyName = yield getLeverCompanyName(url);
        if (!companyName) {
            console.error("Invalid company name");
            return null;
        }
        console.log(`Using Lever URL: ${companyName}`);
        const jobData = yield (0, fetchLeverPageData_1.default)(browser, companyName);
        if (!jobData) {
            console.error("Could not fetch job data from Lever page");
            return null;
        }
        yield (0, post_to_slack_1.reportScraperOutput)(url, jobData.length);
        return jobData;
    });
}
exports.default = getLeverJobsData;
