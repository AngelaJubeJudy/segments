/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // 继承基础配置
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
  
  // 只运行性能测试文件
  testMatch: [
    '**/__tests__/performance/**/*.test.ts'
  ],
  
  // 性能测试专用配置
  testTimeout: 60000, // 性能测试需要更长的超时时间
  
  // 关闭详细输出以减少开销
  verbose: false,
  
  // 强制退出
  forceExit: true,
  
  // 关闭句柄检测以提高性能
  detectOpenHandles: false,
  
  // 扩展名处理
  extensionsToTreatAsEsm: ['.ts'],
  
  // 性能优化配置
  maxWorkers: 1, // 性能测试使用单进程避免资源竞争
  
  // 启用缓存
  cache: true,
  cacheDirectory: '.jest-performance-cache',
  
  // 串行执行性能测试
  runInBand: true,
  
  // 减少 TypeScript 编译开销
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false
    }
  },
  
  // 性能测试专用报告器
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/performance',
      outputName: 'performance-test-results.xml'
    }]
  ],
  
  // 设置环境变量
  setupFilesAfterEnv: [],
  
  // 模块解析优化
  moduleDirectories: ['node_modules', 'src']
};
