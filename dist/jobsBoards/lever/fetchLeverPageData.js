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
function addDescription(jobs, browser) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Adding description");
        for (const job of jobs) {
            console.log(`Merging job ${jobs.indexOf(job) + 1} of ${jobs.length}`);
            const jobLandingPage = yield browser.newPage();
            yield jobLandingPage.goto(job.applyLink);
            job.description = yield jobLandingPage.evaluate(() => {
                const jobDescription = document.querySelector(".content > div:nth-child(2)"); // Select the second div inside the .content class
                return jobDescription ? jobDescription.innerHTML : null; // Return the inner HTML content of the div if it exists, otherwise null
            });
            yield jobLandingPage.close();
        }
        return jobs;
    });
}
// Get the job listings from the API
function fetchLeverPageData(browser, companyName) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://jobs.lever.co/" + companyName;
        const page = yield browser.newPage();
        yield page.goto(url);
        yield page.waitForSelector(".posting");
        const jobs = yield page.$$eval(".postings-group .posting", (postings) => postings.map((posting) => {
            var _a;
            const areasElement = (_a = posting
                .closest(".postings-group")) === null || _a === void 0 ? void 0 : _a.querySelector(".large-category-label");
            const workTypeElement = posting.querySelector(".posting-categories .sort-by-commitment");
            const titleElement = posting.querySelector(".posting-title h5[data-qa='posting-name']");
            const locationElement = posting.querySelector(".posting-title .posting-categories .sort-by-location");
            const workStyleElement = posting.querySelector(".posting-categories .workplaceTypes");
            const jobURLElement = posting.querySelector(".posting .posting-title");
            // Spread the object if the data is available
            return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (jobURLElement && { applyLink: jobURLElement.href })), (titleElement && { title: titleElement.innerText })), (locationElement && { locations: [locationElement.innerText] })), (areasElement && { areas: [areasElement.innerText] })), (workTypeElement && { workType: [workTypeElement.innerText] })), (workStyleElement && { workStyle: [workStyleElement.innerText] }));
        }));
        // Open job links and add the description inside the jobs list
        const updatedJobs = yield addDescription(jobs, browser);
        return updatedJobs;
    });
}
exports.default = fetchLeverPageData;
