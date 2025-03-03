import * as crypto from "crypto";

/**
 * 暗号化キーを複合化する処理
 */
export function decryptGCPServiceAccount() {
  const algorithm = "aes-256-cbc" as crypto.CipherGCMTypes;
  // 環境変数から読み込む
  const key = process.env.DECRYPT_KEY!;
  const iv = process.env.DECRYPT_IV!;
  const source = process.env.ENCRYPTED_KEY!;

  if (!key || !iv || !source) {
    throw new Error("環境変数が設定されていません");
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex") as unknown as crypto.CipherKey,
    Buffer.from(iv, "hex") as unknown as crypto.BinaryLike
  );

  const sourceBuffer = Buffer.from(source, "base64")
  const data = Uint8Array.from(sourceBuffer.subarray(16));
  const start = decipher.update(data) as unknown as  Uint8Array<ArrayBufferLike>;
  const final = decipher.final() as unknown as  Uint8Array<ArrayBufferLike>;
  const result = Buffer.concat([start, final]).toString("utf8");

  // 複合化されたサービスアカウントのJson
  return JSON.parse(result);
}