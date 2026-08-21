import { describe, expect, it } from "vitest";
import { createCloudinaryUploadSignature } from "./cloudinary";

describe("createCloudinaryUploadSignature", () => {
  it("builds a deterministic Cloudinary SHA-1 signature without exposing the secret", () => {
    expect(
      createCloudinaryUploadSignature("schooly/abc/student-photo", "secret", 1_700_000_000),
    ).toEqual({
      folder: "schooly/abc/student-photo",
      timestamp: 1_700_000_000,
      signature: "5a8fcf171e23f2bcd96f55378a5f2061854b874f",
    });
  });
});
