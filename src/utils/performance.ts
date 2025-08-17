import { PerformanceTestResult } from '../types/index.js';

export class PerformanceTimer {
    private startTime: number = 0;
    private endTime: number = 0;

    start(){
        this.startTime = performance.now();
    }

    stop(){
        this.endTime = performance.now();
    }

    getExecTime(){
        return this.endTime - this.startTime;
    }

    resetTimer(){
        this.startTime = 0;
        this.endTime = 0;
    }

}

export class PerformanceTesting { 
    static runTest(func: () => void, iterations: number = 100): PerformanceTestResult{
        const timer = new PerformanceTimer();

        let initMemory = 0;
        if (typeof process !== 'undefined' && process.memoryUsage) {
            initMemory = process.memoryUsage().heapUsed;
        }

        timer.start();
        for (let i = 0; i < iterations; i++) {
            func();
        }
        timer.stop();

        let finalMemory = 0;
        if (typeof process !== 'undefined' && process.memoryUsage) {
            finalMemory = process.memoryUsage().heapUsed;
        }

        return {
            operations: iterations,
            execTime: timer.getExecTime(),
            memUsage: finalMemory - initMemory,
            averageTime: timer.getExecTime() / iterations
        };
    }
}