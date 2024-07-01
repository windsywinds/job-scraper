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
const keywords_1 = require("./keywords");
const purifyDesc_1 = __importDefault(require("./purifyDesc"));
const mapDescription = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const purifiedValue = yield (0, purifyDesc_1.default)(value);
    return purifiedValue;
});
const mapApplyLink = (value) => value.replace(/^(https?:\/\/)?(www\.)?/, 'https://');
const mapTitle = (value) => toPascalCase(value);
const mapWorkStyle = (value) => findMatchAndUpdate(value, keywords_1.WORKSTYLES) || '';
const mapWorkType = (value) => findMatchAndUpdate(value, keywords_1.WORKTYPES) || '';
const mapSeniority = (value) => findMatchAndUpdate(value, keywords_1.SENIORITYS) || '';
const mapLocations = (value) => findMatchAndUpdate(value, keywords_1.LOCATIONS) || '';
const mapTiming = (value) => findMatchAndUpdate(value, keywords_1.TIMING) || '';
const mapBusinessAreas = (value) => findMatchAndUpdate(value, keywords_1.BUSINESS_AREAS) || '';
function dataRationaliser(jobListing) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Keys provided: ${Object.keys(jobListing).join(', ')}`);
        const rationalisedData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ applyLink: mapApplyLink(jobListing.applyLink) }, (jobListing.title && { title: mapTitle(jobListing.title) })), (jobListing.workStyle && { workStyle: mapWorkStyle(jobListing.workStyle) })), (jobListing.workType && { workType: mapWorkType(jobListing.workType) })), (jobListing.seniority && { seniority: mapSeniority(jobListing.seniority) })), (jobListing.locations && { locations: mapLocations(jobListing.locations) })), (jobListing.timing && { timing: mapTiming(jobListing.timing) })), (jobListing.areas && { areas: mapBusinessAreas(jobListing.areas) })), (jobListing.description && { description: yield mapDescription(jobListing.description) }));
        for (const [key, value] of Object.entries(rationalisedData)) {
            if (!value) {
                delete rationalisedData[key];
            }
        }
        return rationalisedData;
    });
}
function findMatchAndUpdate(keyword, keywordArray) {
    let newArray = keyword;
    let matches = {};
    // if value is a string split words and create newArray
    if (typeof keyword === "string") {
        const value = keyword.toUpperCase();
        newArray = value.split(",").map((word) => word.trim());
    }
    if (typeof newArray === "object") {
        for (const key in newArray) {
            if (Object.hasOwnProperty.call(newArray, key)) {
                const value = newArray[key].toUpperCase();
                for (const arr of keywordArray) {
                    if (arr.includes(value)) {
                        console.log(`Match found in array from provided value: "${value}" matching keywords: "${arr}"`);
                        matches = [arr[0]];
                        break;
                    }
                }
            }
        }
    }
    if (Object.keys(matches).length > 0) {
        return matches;
    }
    else {
        console.log(`no match found for: ${newArray}`);
        return null;
    }
}
function toPascalCase(str) {
    return str
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
        return word.toUpperCase();
    })
        .replace(/^\s+|\s+$/g, '');
}
exports.default = dataRationaliser;
