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
  testTimeout: 30000,
  
  // 详细输出
  verbose: false,
  
  // 强制退出
  forceExit: true,
  
  // 检测打开句柄 - 关闭以减少性能开销
  detectOpenHandles: false,
  
  // 扩展名处理
  extensionsToTreatAsEsm: ['.ts'],
  
  // 性能优化配置
  // 最大工作进程数 - 根据 CPU 核心数优化
  maxWorkers: '50%',
  
  // 测试运行器 - 使用更快的运行器
  runner: 'jest-runner',
  
  // 缓存配置 - 启用缓存以提高重复测试速度
  cache: true,
  cacheDirectory: '.jest-cache',
  
  // 并行执行配置
  // 允许测试并行运行（对于独立的测试套件）
  runInBand: false,
  
  // 测试隔离 - 减少不必要的隔离开销
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  
  // 模块解析优化
  moduleDirectories: ['node_modules', 'src'],
  
  // 设置全局超时 - 为所有测试设置合理的超时
  setupFilesAfterEnv: [],
  
  // 测试报告配置 - 减少报告生成开销
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/junit',
      outputName: 'js-test-results.xml',
      classNameTemplate: '{classname}-{title}',
      titleTemplate: '{classname}-{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ],
  
  // 性能监控配置
  globals: {
    'ts-jest': {
      // 减少 TypeScript 编译开销
      isolatedModules: true,
      // 启用诊断信息（可选，用于调试）
      diagnostics: false
    }
  }
}; 