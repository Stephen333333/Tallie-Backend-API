import crypto from "crypto";

export const escapeRegex = function (string: any) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export function encrypt(data: any) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedData: any) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
  const [ivHex, encryptedText] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export const pickAllowedFields = <T extends object>(
  source: Partial<T>,
  allowedFields: readonly (keyof T)[]
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(source).filter(
      ([key, value]) =>
        allowedFields.includes(key as keyof T) && value !== undefined
    )
  ) as Partial<T>;
};
