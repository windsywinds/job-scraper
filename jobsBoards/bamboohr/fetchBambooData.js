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
function fetchBambooFromAPI(companyName) {
    return __awaiter(this, void 0, void 0, function* () {
        const constructedUrl = `https://${companyName}.bamboohr.com/careers/list`;
        try {
            const response = yield fetch(constructedUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const responseData = yield response.json();
            // Check if responseData.results is an array, if not, wrap it in an array
            const data = Array.isArray(responseData.result)
                ? responseData.result
                : [responseData.result];
            // Loop over each job in data array to add any additional data from each jobs listing page
            for (let index = 0; index < data.length; index++) {
                const job = data[index];
                console.log(`Merging job ${data.indexOf(job) + 1} of ${data.length}: ${String(job.id)}`);
                // Introduce a delay between each fetch request to prevent being rate limited
                //await new Promise(resolve => setTimeout(resolve, index * 1000));
                try {
                    // Convert job.id to string before using it in the URL
                    const jobResponse = yield fetch(`https://${companyName}.bamboohr.com/careers/${String(job.id)}/detail`);
                    if (jobResponse.ok) {
                        const jobData = yield jobResponse.json();
                        // Merge additional fields from the job details into the original job object
                        Object.assign(job, jobData);
                    }
                    else {
                        throw new Error("Network response was not ok");
                    }
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.error("Error fetching job details:", error.message);
                    }
                    else {
                        console.error("Unexpected error:", error);
                    }
                    // Continue with the loop even if there's an error fetching job details
                }
            }
            console.log("Merge complete");
            return data;
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
exports.default = fetchBambooFromAPI;
