"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVariables = void 0;
const zod_1 = require("zod");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const schemaEnv = zod_1.z.object({
    PORT: zod_1.z.string().nonempty(),
    NODE_ENV: zod_1.z
        .string()
        .refine((value) => value === "production" || value === "development", {
        message: "NODE_ENV must be 'production' or 'development",
    }),
    APIKEY: zod_1.z.string(),
    MONGOOSE_URL: zod_1.z.string(),
    CLOUDINARY_NAME: zod_1.z.string(),
    CLOUDINARY_APIKEY: zod_1.z.string(),
    CLOUDINARY_APISECRET: zod_1.z.string(),
});
exports.envVariables = schemaEnv.parse(process.env);
//# sourceMappingURL=envVariables.js.map