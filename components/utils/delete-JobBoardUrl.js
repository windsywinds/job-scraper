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
const { reportError } = require("./post-to-slack");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function removeJobBoard(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const companyJobBoard = yield prisma.company.findFirst({
                where: { jobBoardUrl: url },
            });
            if (companyJobBoard) {
                yield prisma.company.update({
                    where: { id: companyJobBoard.id },
                    data: { jobBoardUrl: { unset: true } },
                });
                yield reportError(url);
                console.log("jobBoardUrl removed for company:", companyJobBoard.name);
            }
            else {
                console.log("Company board not found for URL:", url);
                return null;
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.default = removeJobBoard;
