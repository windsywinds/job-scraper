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
const checkAndUpdateJob_1 = __importDefault(require("./checkAndUpdateJob"));
const rationaliseData_1 = __importDefault(require("./rationaliseData"));
const post_to_slack_1 = require("./utils/post-to-slack");
const get_CompanyId_1 = __importDefault(require("./utils/get-CompanyId"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function finaliseDataEntry(inputJobData, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let jobsAdded = 0;
        let updatedJobs = 0;
        let alreadyExistingJobs = 0;
        let discardedJob = 0;
        const companyId = yield (0, get_CompanyId_1.default)(url);
        try {
            // Loop through inputJobData and create records for each item
            for (const job of inputJobData) {
                // rationalise data
                console.log(`Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} is getting itself RATIONALISED`);
                const rationalisedData = yield (0, rationaliseData_1.default)(job);
                // Ensure rationalisedData contains necessary fields for database operations
                if (rationalisedData && rationalisedData.applyLink) {
                    rationalisedData.companyId = companyId || undefined;
                    console.log("Rationalisation complete, attempting to add to DB...");
                    // Type assertion to ensure all required properties are present
                    if (rationalisedData) {
                        const eachjob = yield (0, checkAndUpdateJob_1.default)(rationalisedData);
                        if (eachjob) {
                            if (eachjob === "Job Update") {
                                console.log(`Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length}, has been updated in the database.`);
                                updatedJobs++;
                            }
                            else {
                                console.log(`Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} is already in the database.`);
                                alreadyExistingJobs++;
                            }
                        }
                        else {
                            const currentDate = new Date();
                            const isoDateString = currentDate.toISOString();
                            rationalisedData.createdAt = isoDateString;
                            yield prisma.job.create({
                                data: rationalisedData, // Ensure the data matches JobCreateInput without id
                            });
                            console.log(`Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} has been added to the database: ${job.title ? job.title : ""}`);
                            jobsAdded++;
                        }
                    }
                    else {
                        console.log("Job listing was discarded due to missing required fields");
                        discardedJob++;
                    }
                }
                else {
                    console.log("Job listing was discarded due to missing applyLink");
                    discardedJob++;
                }
            }
        }
        catch (err) {
            console.error("ERROR with rationalisation or database functions:", err);
        }
        finally {
            // calculate the number of jobs that were not added to the database for reporting
            const removedJobs = inputJobData.length - jobsAdded - updatedJobs - alreadyExistingJobs;
            yield (0, post_to_slack_1.reportDatabaseInsert)(jobsAdded, removedJobs, updatedJobs, alreadyExistingJobs);
        }
    });
}
exports.default = finaliseDataEntry;
