import { IntensitySegments } from './IntensitySegments.js';

// 创建实例
const segments = new IntensitySegments();
console.log('Initial:', segments.toString());

// 测试: add(10, 11, 1)
segments.add(10, 11, 1);
console.log('After add(10, 11, 1):', segments.toString());
console.log('Boundaries:', segments.getSegments());
console.log('Intensity at 10:', segments._calcIntensity(10));
console.log('Intensity at 11:', segments._calcIntensity(11));
console.log('Intensity at 9:', segments._calcIntensity(9));
console.log('Intensity at 12:', segments._calcIntensity(12)); 