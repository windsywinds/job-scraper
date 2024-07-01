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
function multipleJobPage(pages, organizationName) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobsWithMultiplePages = [];
        try {
            for (let i = 1; i <= pages; i++) {
                const response = yield fetch(`https://services.employmenthero.com/ats/api/v1/career_page/organisations/${organizationName}/jobs?item_per_page=10&page_index=${i}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const output = yield response.json();
                jobsWithMultiplePages.push(...output.data.items); // Concatenate job data from each page
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching job details:", error.message);
            }
            else {
                console.error("Unexpected error:", error);
            }
        }
        return jobsWithMultiplePages;
    });
}
function fetchSwagappData(companyName) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobEndpoint = `https://services.employmenthero.com/ats/api/v1/career_page/organisations/${companyName}/jobs?item_per_page=10&page_index=1`;
        try {
            const response = yield fetch(jobEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const job = data;
            const jobPages = yield job.data.total_pages; //get the total pages of jobs
            if (jobPages === 1) {
                return job.data.items; // Return items from the first page
            }
            else {
                const allData = yield multipleJobPage(jobPages, companyName);
                return allData;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching jobs:", error.message);
            }
            else {
                console.error("Unexpected error:", error);
            }
            return null;
        }
    });
}
exports.default = fetchSwagappData;
