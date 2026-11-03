/** Safe validation errors that can be returned to public sponsor checkout clients. */
export class SponsorUploadError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "SponsorUploadError";
  }
}
