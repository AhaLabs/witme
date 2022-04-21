import { Binary } from ".";
import { join } from "path";
import * as os from "os";

// function getPlatform() {
//   const type = os.type();
//   const arch = os.arch();

//   if ((type === "Linux" || type === "Darwin") && arch === "x64") {
//     return [type, "x86_64"];
//   }
//   throw new Error(`Unsupported platform: ${type} ${arch}`);
// }

export function AWSUrl(): string {
  // const [platform, arch] = getPlatform();
  return `https://github.com/AhaLabs/witme/releases/download/v0.2.5/witme-v0.2.5-x86_64-apple-darwin.tar.gz`;
}

export function getBinary(name: string = "witme"): Promise<Binary> {
  if (!process.env["WITME_BIN_PATH"]) {
    process.env["WITME_BINARY_PATH"] = join(
      os.homedir(),
      ".witme",
      "witme"
    );
  }

  // Will use version after publishing to AWS
  // const version = require("./package.json").version;
  const fromEnv = process.env["WITME_ARTIFACT_URL"];
  const urls = [AWSUrl()];
  if (fromEnv) {
    urls.unshift(fromEnv);
  }

  return Binary.create(name, urls);
}
