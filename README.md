
# Core Functions
## Data Structure
1. segments[]：只记录边界变化，区间中各点的 intensity 值按需推算
2. segments[] 由两部分数组组成：边界点，强度值

## Core Algorithm
1. add(from, to, amount): 在指定区间 '[from, to)'增加强度值
2. set(from, to, amount): 在指定区间 '[from, to)'设置强度值
3. toString(): 返回字符串表示

## Design
1. 编程语言: TypeScript
2. 代码质量控制：ESLint
3. 依赖管理：nmp
4. 测试框架：Jest

---

# Quick Start
## Installation and Run
1. 安装依赖
```bash
npm install
```

2. 构建项目
```bash
npm run build
```

## Development Commands
```bash
# 开发模式
npm run dev

# 启动模式
npm run start

# 运行示例代码
npm run example

# 运行调试代码
npm run debug
```

## Testing
```bash
# 运行所有测试
npm test

# 单元测试
npm run test:unit

# 性能测试
npm run test:performance

# 生成覆盖率报告
npm run test:coverage
```

## Format Checking
```bash
# 代码风格检查（配置文件：`.eslintrc.js`）
npm run lint

# 自动修复问题
npm run lint:fix

# 代码风格统一
npm run format
```

### Run
```bash
npm run dev
```


## Examples
```typescript
const segments = new IntensitySegments();
segments.toString(); // should be "[]"

segments.add(10, 30, 1);
segments.toString(); // should be "[[10, 1], [30, 0]]"

segments.add(20, 40, 1);
segments.toString();// should be "[[10, 1], [20, 2], [30, 1], [40, 0]]"

segments.add(10, 40, -2);
segments.toString();// should be "[[10, -1], [20, 0], [30, -1], [40, 0]]"
```

---

# Code Style Control
## Code Organization
1. 项目结构
```
/
├── src/
│   ├── IntensitySegments.ts          # 核心函数
│   ├── types/
│   │   └── index.ts                  # 类型定义
│   ├── constants/
│   │   └── index.ts                  # 常量定义
│   ├── utils/
│   │   ├── validator.ts              # 核心功能工具函数
│   │   └── performance.ts            # 性能检测工具函数
│   ├── __tests__/
│   │   ├── unit/                      # 单元测试
│   │   │   ├── IntensitySegments.test.ts
│   │   │   └── validation.test.ts
│   │   ├── performance/               # 性能测试
│   │   │   └── IntensitySegments.performance.test.ts
│   │   └── setup.ts                   # 测试配置
│   └── example.ts                     # 题目示例
├── package.json                       # 项目配置
├── tsconfig.json                      # TypeScript 配置
├── jest.config.js                     # Jest 测试配置
├── .eslintrc.js                       # ESLint 配置
├── .gitignore                         # Git 忽略
└── README.md                          # 项目说明
```

2. 模块化设计
- 项目结构清晰，易于后期新增功能
- 项目结构完整可维护，易于合作

## Readability
- 命名规范，意义明确
- 代码结构清晰：函数及参数说明，

## Documentation
- README 已给出完整的项目说明
- 各代码文件內注释逻辑完整，清晰可读

## Testing
1. 单元测试
- 覆盖 3 大核心功能
- 覆盖正常、异常、边界条件及数据
2. 性能测试
- 内存使用测试
- 压力表现测试

## Deliverability
- 完整的构建配置
- 使用代码质量检查工具
- 配合用例进行自动化测试


