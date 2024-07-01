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
const fetchBambooData_1 = __importDefault(require("./fetchBambooData"));
const post_to_slack_1 = require("../../components/utils/post-to-slack");
//find the name of the business
function getBambooCompanyName(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = url.match(/https:\/\/([^\.]+)\.bamboohr\.com/);
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
//get the job listings from the API
function getBambooData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        //get data using api
        const companyName = yield getBambooCompanyName(url);
        if (!companyName) {
            console.error("Invalid company name");
            return null;
        }
        const bambooJobData = yield (0, fetchBambooData_1.default)(companyName);
        if (!bambooJobData) {
            console.error("Could not fetch job data from Bamboo API");
            return null;
        }
        const applyLink = `https://${companyName}.bamboohr.com/careers/`;
        // Upload JSON data for all jobs related to the URL given
        const jobData = bambooJobData.map((job, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ status: ((_a = job.result.jobOpening) === null || _a === void 0 ? void 0 : _a.jobOpeningStatus)
                    ? job.result.jobOpening.jobOpeningStatus
                    : "" }, (job.id ? { applyLink: applyLink + job.id } : {})), (((_b = job.result.jobOpening) === null || _b === void 0 ? void 0 : _b.jobOpeningName)
                ? { title: job.result.jobOpening.jobOpeningName }
                : {})), (((_c = job.result.jobOpening) === null || _c === void 0 ? void 0 : _c.locationType) === "0"
                ? { workStyle: "On Site" }
                : ((_d = job.result.jobOpening) === null || _d === void 0 ? void 0 : _d.locationType) === "1"
                    ? { workStyle: "Remote" }
                    : ((_e = job.result.jobOpening) === null || _e === void 0 ? void 0 : _e.locationType) === "2"
                        ? { workStyle: "Hybrid" }
                        : {})), (((_f = job.result.jobOpening) === null || _f === void 0 ? void 0 : _f.employmentStatusLabel)
                ? { workType: job.result.jobOpening.employmentStatusLabel }
                : {})), (((_g = job.result.jobOpening) === null || _g === void 0 ? void 0 : _g.minimumExperience)
                ? { seniority: job.result.jobOpening.minimumExperience }
                : {})), (((_j = (_h = job.result.jobOpening) === null || _h === void 0 ? void 0 : _h.location) === null || _j === void 0 ? void 0 : _j.city)
                ? { locations: job.result.jobOpening.location.city }
                : {})), (((_k = job.result.jobOpening) === null || _k === void 0 ? void 0 : _k.departmentLabel)
                ? { areas: (_l = job.result.jobOpening) === null || _l === void 0 ? void 0 : _l.departmentLabel }
                : {})), (((_m = job.result.jobOpening) === null || _m === void 0 ? void 0 : _m.description)
                ? { description: (_o = job.result.jobOpening) === null || _o === void 0 ? void 0 : _o.description }
                : {})));
        });
        yield (0, post_to_slack_1.reportScraperOutput)(url, jobData.length);
        return jobData;
    });
}
exports.default = getBambooData;
