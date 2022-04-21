"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinary = exports.AWSUrl = void 0;
const _1 = require(".");
const path_1 = require("path");
const os = require("os");
// function getPlatform() {
//   const type = os.type();
//   const arch = os.arch();
//   if ((type === "Linux" || type === "Darwin") && arch === "x64") {
//     return [type, "x86_64"];
//   }
//   throw new Error(`Unsupported platform: ${type} ${arch}`);
// }
function AWSUrl() {
    // const [platform, arch] = getPlatform();
    return `https://github.com/AhaLabs/witme/releases/download/v0.2.5/witme-v0.2.5-x86_64-apple-darwin.tar.gz`;
}
exports.AWSUrl = AWSUrl;
function getBinary(name = "witme") {
    if (!process.env["WITME_BIN_PATH"]) {
        process.env["WITME_BINARY_PATH"] = (0, path_1.join)(os.homedir(), ".witme", "witme");
    }
    // Will use version after publishing to AWS
    // const version = require("./package.json").version;
    const fromEnv = process.env["WITME_ARTIFACT_URL"];
    const urls = [AWSUrl()];
    if (fromEnv) {
        urls.unshift(fromEnv);
    }
    return _1.Binary.create(name, urls);
}
exports.getBinary = getBinary;
