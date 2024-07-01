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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function checkAndUpdateJob(job) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find the job in the database based on title and applyLink
            const existingJob = yield prisma.job.findFirst({
                where: {
                    title: job.title,
                    applyLink: job.applyLink,
                },
            });
            // If a job with the same title and applyLink exists
            if (existingJob) {
                // Check if the description is different
                if (existingJob.description !== job.description &&
                    existingJob.applyLink === job.applyLink) {
                    // If the description is different, update the job
                    yield prisma.job.update({
                        where: { id: existingJob.id },
                        data: job,
                    });
                    return "Job Update";
                }
                else {
                    // If the description is the same, return the existing job
                    return existingJob;
                }
            }
            else {
                // If no job with the same title and applyLink exists, return null
                return null;
            }
        }
        catch (err) {
            console.error(err);
            return null;
        }
    });
}
exports.default = checkAndUpdateJob;
