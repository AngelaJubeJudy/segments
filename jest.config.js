/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // 预设配置 - 使用默认预设避免ESM冲突
  preset: 'ts-jest',
  
  // 测试环境
  testEnvironment: 'node',
  
  // 转换器配置 - 优化TypeScript处理
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      // 启用缓存
      isolatedModules: true,
      // 禁用类型检查以提升性能
      diagnostics: false
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
  
  // 性能优化配置
  verbose: false, // 关闭详细输出以提升性能
  forceExit: true,
  detectOpenHandles: true,
  
  // 启用缓存以提升性能
  cache: true,
  cacheDirectory: '.jest-cache',
  
  // 并行执行测试
  maxWorkers: '50%',
  
  // 设置测试环境变量
  setupFilesAfterEnv: [],
  
  // 扩展名处理
  extensionsToTreatAsEsm: ['.ts']
}; 