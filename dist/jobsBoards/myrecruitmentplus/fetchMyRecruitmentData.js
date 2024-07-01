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
function fetchMyRecruitmentData(browser, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        console.log(`Navigating to ${url}`);
        yield page.goto(url);
        // Wait for the job listings to load
        yield page.waitForSelector(`[class="adlogic_job_results"]`);
        const jobs = yield page.$$eval(`[class="position"]`, (elements) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log("Number of elements found:", elements.length);
            const jobsData = [];
            for (const e of elements) {
                // MyRecruitMentPlus has an empty entry at the end of their page which is likely used for adding a new job
                // this if statement will filter it out from the collected data
                const applyLinkElement = e.querySelector('h2 a');
                if (applyLinkElement && applyLinkElement.getAttribute('href') !== '{job_link}') {
                    const locationElements = e.querySelectorAll('.ajb_location li');
                    const locationArray = Array.from(locationElements).map(li => li.innerText);
                    const jobData = {
                        applyLink: applyLinkElement.getAttribute('href') || '',
                        title: ((_a = e.querySelector('h2')) === null || _a === void 0 ? void 0 : _a.innerText) || '',
                        workType: '',
                        locations: locationArray.length ? locationArray : [''],
                        areas: [((_b = e.querySelector('.ajb_classification')) === null || _b === void 0 ? void 0 : _b.innerText) || ''],
                        description: '',
                    };
                    jobsData.push(jobData);
                }
            }
            return jobsData;
        }));
        // Visit each job posting page to extract the description and workType
        for (const job of jobs) {
            const jobPage = yield browser.newPage();
            yield jobPage.goto(job.applyLink);
            console.log("Navigating to job page", jobs.indexOf(job) + 1, "of", jobs.length, ":", job.applyLink);
            // Add to the job entry data
            try {
                yield jobPage.waitForSelector('[id="jobTemplateTitleId"]', { timeout: 5000 });
                job.description = yield jobPage.$eval('[id="jobTemplateBodyContainerId"]', (element) => element.innerText);
                job.workType = yield jobPage.$eval('#adlogic_job_details_job_info :nth-child(3)', (element) => element.innerText.split(', '));
            }
            catch (error) {
                console.error(`Error extracting description for job ${job.title}:`, error.message);
                // Use empty string if the elements do not exist
                job.description = '';
                job.workType = '';
            }
            yield jobPage.close();
        }
        return jobs;
    });
}
exports.default = fetchMyRecruitmentData;
