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
function getCompanyId(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const isNotLocalDatabase = process.env.DOCKER_ENVIRONMENT === "true";
        if (isNotLocalDatabase) {
            try {
                const companyData = yield prisma.company.findFirst({
                    where: { jobBoardUrl: url },
                });
                if (companyData) {
                    return companyData.id;
                }
                else {
                    console.log("Company not found for URL:", url);
                    return null;
                }
            }
            catch (err) {
                console.error("Error fetching company data:", err);
                return null;
            }
            finally {
                yield prisma.$disconnect();
            }
        }
        else {
            console.log("Company ID set to '12345' for local testing");
            return '12345';
        }
    });
}
exports.default = getCompanyId;
