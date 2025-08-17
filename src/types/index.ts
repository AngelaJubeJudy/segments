/**
 * 数据结构
 * [0]: 位置
 * [1]: 强度变化
 */
export type Segment = [number, number];

/**
 * 输入变量检查结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
} 

/**
 * 各点强度统计结果
 */
export interface IntensityResult {
  position: number;
  intensity: number;
}

/**
 * 性能测试结果
 */
export interface PerformanceTestResult {
  operations: number;
  execTime: number;
  memUsage: number;
  averageTime: number;
}