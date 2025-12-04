"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountryFromIp = getCountryFromIp;
const axios_1 = __importDefault(require("axios"));
async function getCountryFromIp(ipAddress) {
    const url = `https://ipapi.co/${ipAddress}/json/`;
    try {
        const response = await axios_1.default.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error(`Something went wrong while fetching IP data:`, error);
        throw error;
    }
}
//# sourceMappingURL=ip-address.utils.js.map