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
const removeJobBoard = require("../components/utils/delete-JobBoardUrl");
const getGreenHouseData = require("./greenhouse/greenhouse");
const keywords = [
    "greenhouse.io",
    "lever.co",
    "workable.com",
    "swagapp",
    "myrecruitmentplus",
    "bamboohr",
];
//this function will search the page html if no network request is identified
const checkHtml = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield page.evaluate(() => {
        return document.documentElement.outerHTML;
    });
    const keyword = keywords.find((keyword) => html.toLowerCase().includes(keyword.toLowerCase()));
    if (keyword) {
        console.log(`KEYWORD MATCH "${keyword}" found on the page`);
        return keyword;
    }
    else {
        console.log(`No keywords found on the page`);
        return null;
    }
});
function searchForJobBoardType(browser, url) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        const fetchedUrls = [];
        let confirmedUrl = url;
        let boardType = "Unknown";
        page.on("response", (response) => {
            const apiUrl = response.url();
            fetchedUrls.push(apiUrl);
            if (apiUrl.includes("embed/job_board/js?for=") ||
                apiUrl.includes("https://boards-api.greenhouse.io/v1/boards/")) {
                boardType = "greenhouse.io";
                confirmedUrl = apiUrl;
                page.removeAllListeners("response");
            }
            else if (fetchedUrls.length > 100) {
                console.log(`Page has exceeded ${fetchedUrls.length} requests with no results. Ending monitoring.`);
                page.removeAllListeners("response");
            }
        });
        try {
            yield page.goto(url);
            console.log("No board type found in network requests, checking html for keywords");
            const keyword = yield checkHtml(page);
            if (keyword) {
                boardType = keyword;
            }
        }
        catch (err) {
            console.log(err);
        }
        return { confirmedUrl, boardType };
    });
}
function findJobBoardFromUrl(browser, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let confirmedUrl = url;
        const jobBoardPlatform = yield searchForJobBoardType(browser, url);
        const boardType = jobBoardPlatform.boardType;
        confirmedUrl = jobBoardPlatform.confirmedUrl;
        let jobData = [];
        if (boardType && boardType !== "Unknown") {
            if (boardType.includes("greenhouse.io")) {
                jobData = yield getGreenHouseData(confirmedUrl);
            }
            // add more board conditions here as found
        }
        else {
            yield removeJobBoard(url);
        }
        return jobData;
    });
}
exports.default = findJobBoardFromUrl;
