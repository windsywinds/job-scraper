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
const fetchSwagappData_1 = __importDefault(require("./fetchSwagappData"));
const post_to_slack_1 = require("../../components/utils/post-to-slack");
function getCompanyName(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = url.match(/\/organisations\/([^/]+)/);
        if (!match || !match[1]) {
            console.error("Could not extract company name from URL");
            return null;
        }
        const companyName = match[1];
        return companyName;
    });
}
function getSwagappData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const companyName = yield getCompanyName(url);
        if (!companyName) {
            console.error("Invalid company name");
            return null;
        }
        const swagJobData = yield (0, fetchSwagappData_1.default)(companyName);
        if (!swagJobData) {
            console.error("Could not fetch job data from Bamboo API");
            return null;
        }
        const jobData = swagJobData.map((job, index) => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (job.id ? { applyLink: `https://jobs.swagapp.com/jobs/${job.id}` } : {})), (job.title ? { title: job.title } : {})), (job.workplace_type ? { workStyle: job.workplace_type } : {})), (job.employment_type_name ? { workType: job.employment_type_name } : {})), (job.experience_level_name
            ? { seniority: job.experience_level_name }
            : {})), (job.vendor_location_name
            ? { locations: job.vendor_location_name }
            : {})), (job.description ? { description: job.description } : {}))));
        yield (0, post_to_slack_1.reportScraperOutput)(url, jobData.length);
        return jobData;
    });
}
exports.default = getSwagappData;
