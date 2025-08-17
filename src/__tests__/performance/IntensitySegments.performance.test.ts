import { IntensitySegments } from '../../IntensitySegments';
import { PerformanceTesting } from '../../utils/performance';

describe('IntensitySegments', () => {
    let segments = new IntensitySegments;

    beforeEach(() => {
        segments = new IntensitySegments();
    });

    describe('Stress Test', () => {
        test('should handle 1M segments without OOM', () => {
            const startMem = process.memoryUsage().heapUsed;
            for (let i = 0; i < 100000; i++) {
                segments.add(i, i + 1, 1);
            }

            const endMem = process.memoryUsage().heapUsed;
            const memUsage = (endMem - startMem) / 1024 / 1024;
            expect(memUsage).toBeLessThan(100);
        });

        test('should maintain performance as operations increase', () => {
            const testFunction = () => {
                const tempSegments = new IntensitySegments();
                for (let i = 0; i < 1000; i++) {
                    tempSegments.add(i, i + 10, 1);
                }
                
                for (let i = 0; i < 100; i++) {
                    tempSegments.set(i, i + 1, 2);
                }

            }

            const result = PerformanceTesting.runTest(testFunction, 10);
            expect(result.execTime).toBeLessThan(1000);  //1s
            expect(result.memUsage).toBeLessThan(1024 * 1024); // 1MB
        });
    });
});