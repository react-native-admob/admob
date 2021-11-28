export default class AdError extends Error {
  name = 'AdError';
  /**
   * AdError
   * @param message - The error description message.
   * @param code - The error code.
   * @link https://support.google.com/admob/answer/9905175
   */
  constructor(public readonly message: string, public readonly code?: number) {
    super();
  }
}
