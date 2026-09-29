import crypto from "node:crypto";
import { ENCRYPTION_KEY, IVLENGTH } from "../../../config/config.service.js";

const EncKey = ENCRYPTION_KEY;
const IVLength = IVLENGTH;

export const Encrypt = async (plaintext) => {
  const iv = crypto.randomBytes(IVLength);
  const cipher = crypto.createCipheriv("aes-256-cbc", EncKey, iv);
  let encrypted = cipher.update(plaintext, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

export const Decrypt = async (cipherText) => {
  const [ivHex, encryptedText] = cipherText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", EncKey, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
