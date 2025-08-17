/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // 预设配置
  preset: 'ts-jest/presets/default-esm',
  
  // 测试环境
  testEnvironment: 'node',
  
  // 转换器配置
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json'
    }]
  },
  
  // 测试文件匹配模式
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts'
  ],
  
  // 覆盖率配置
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  
  // 覆盖率目录
  coverageDirectory: 'coverage',
  
  // 覆盖率报告格式
  coverageReporters: ['text', 'lcov', 'html'],
  
  // 模块文件扩展名
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // 清除模拟
  clearMocks: true,
  
  // 恢复模拟
  restoreMocks: true,
  
  // 重置模拟
  resetMocks: true,
  
  // 测试超时时间（毫秒）
  testTimeout: 10000,
  
  // 详细输出
  verbose: true,
  
  // 强制退出
  forceExit: true,
  
  // 检测打开句柄
  detectOpenHandles: true,
  
  // 扩展名处理
  extensionsToTreatAsEsm: ['.ts']
}; 