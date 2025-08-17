export const INTENSITY_CONSTANTS = {
  /** 初始强度 */
  INITIAL_INTENSITY: 0 as number,

  /** 零值 */
  ZERO_INTENSITY: 0 as number,

  /** 最小强度变化 */
  MIN_AMOUNT: Number.MIN_SAFE_INTEGER,

  /** 最大强度变化 */
  MAX_AMOUNT: Number.MAX_SAFE_INTEGER,

} as const;

export const RANGE_CONSTANTS = {
  /** 最小区间长度 */
  MIN_SEGMENT_LEN: 1,
  /** 最大区间长度 */
  MAX_SEGMENT_LEN: Number.MAX_SAFE_INTEGER,
} as const;