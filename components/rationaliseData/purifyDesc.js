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
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
function purifyDesc(description) {
    return __awaiter(this, void 0, void 0, function* () {
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        // Configure what should be accepted and rejected
        const config = {
            ALLOWED_TAGS: ['a'],
            ADD_ATTR: ['href', 'target'],
            FORBID_ATTR: ['class'],
            FORBID_TAGS: ['script'],
        };
        const cleanDesc = DOMPurify.sanitize(description, config);
        return cleanDesc;
    });
}
exports.default = purifyDesc;
