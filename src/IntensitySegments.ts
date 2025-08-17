import { Segment } from './types/index';
import { validateInput, validatePosition } from './utils/validator';
import { INTENSITY_CONSTANTS } from './constants/index';

/**
 * 【数据结构设计】区间强度管理：每个边界点记录从该点开始的强度值
 * 优势：
 * 1. 插入操作：O(n) - 需要重新计算受影响区间的强度值
 * 2. 查询操作：O(log n) - 二分查找前一个边界点
 * 
 * 【核心思想】每个边界点记录从该点开始的强度值
 * 当某点的强度变为0时，该边界点被删除（除了最后一个点）
 */
export class IntensitySegments {
    // 使用有序数组存储边界点，每个点记录从该点开始的强度值
    private boundaries: number[] = [];
    private intensities: number[] = [];
    
    constructor() {}

    /**
     * Public Function 1: 累计 interval intensity
     * 
     * @param from - 区间起始点
     * @param to - 区间结束点
     * @param amount - intensity 值
     * 
     * @example
     * ```typescript
     * segments.add(10, 30, 1);  // 在[10,30)上增加强度1，输出 "[[10, 1], [30, 0]]"
     * segments.add(20, 40, 1);  // 在[20,40)上增加强度1，输出 "[[10, 1], [20, 2], [30, 2], [40, 1]]"
     * segments.add(10, 40, -2);  // 在[10,40)上减少强度2，输出 "[[10, -1], [20, 0], [30, -1], [40, 0]]"
     * ```
     */
    add(from: number, to: number, amount: number): void {
        // 检查入参
        const validInput = validateInput(from, to, amount);
        if (!validInput.isValid) {
            throw new Error(`Invalid input: ${validInput.errors.join(', ')}`);
        }

        // 不变化，不计算
        if (amount === INTENSITY_CONSTANTS.ZERO_INTENSITY) {
            return;
        }

        // 更新区间内的强度值
        this._updateInterval(from, to, amount, false);
    }
    
    /**
     * Public Function 2: 设置 interval intensity
     * 
     * @param from - 区间起始点
     * @param to - 区间结束点
     * @param amount - intensity 值
     * 
     * @example
     * segments.set(10, 30, 1);  // 在[10,30)上设置强度1，输出 "[[10, 1], [30, 0]]"
     * segments.set(10, 30, 4);  // 在[10,30)上设置强度4，输出 "[[10, 4], [30, 0]]"
     * ```
     */
    set(from: number, to: number, amount: number): void {
        // 检查入参
        const validInput = validateInput(from, to, amount);
        if (!validInput.isValid) {
            throw new Error(`Invalid input: ${validInput.errors.join(', ')}`);
        }

        // 先清除区间内的所有变化
        this._clearInterval(from, to);
        
        // 设置新的强度值
        if (amount !== INTENSITY_CONSTANTS.ZERO_INTENSITY) {
            this._updateInterval(from, to, amount, true);
        }
    }

    /**
     * Public Function 3: 格式化当前边界下 intensity 值
     * 返回格式：[[position, intensityValue], ...]
     */
    toString(): string {
        const segments: Segment[] = [];
        
        // 直接返回边界点和强度值
        for (let i = 0; i < this.boundaries.length; i++) {
            segments.push([this.boundaries[i], this.intensities[i]]);
        }
        
        return JSON.stringify(segments);
    }

    // Helper function：快速读取 segments 数组
    getSegments(): Segment[] {
        const segments: Segment[] = [];
        
        for (let i = 0; i < this.boundaries.length; i++) {
            segments.push([this.boundaries[i], this.intensities[i]]);
        }
        
        return segments;
    }

    // Helper function：快速读取 segments 长度
    getLength(): number {
        return this.boundaries.length;
    }

    /**
     * Private Function: 更新区间强度值
     * 复杂度：O(n) - 需要重新计算所有受影响区间的强度值
     */
    private _updateInterval(from: number, to: number, amount: number, isSet: boolean): void {
        // 收集所有需要处理的边界点
        const pointsToProcess = new Set<number>();
        pointsToProcess.add(from);
        pointsToProcess.add(to);
        
        // 添加所有现有的边界点
        for (let i = 0; i < this.boundaries.length; i++) {
            pointsToProcess.add(this.boundaries[i]);
        }
        
        // 转换为数组并排序
        const sortedPoints = Array.from(pointsToProcess).sort((a, b) => a - b);
        
        // 重新计算每个边界点的强度值
        const newBoundaries: number[] = [];
        const newIntensities: number[] = [];
        
        for (let i = 0; i < sortedPoints.length; i++) {
            const position = sortedPoints[i];
            let newIntensity: number;
            
            if (isSet) {
                // set操作：计算该点的新强度值
                if (position >= from && position < to) {
                    newIntensity = amount;
                } else {
                    // 对于set操作，需要找到该点之前的强度值
                    newIntensity = this._getIntensityAtPositionBeforeUpdate(position, from, to, amount);
                }
            } else {
                // add操作：计算该点的累积强度值
                newIntensity = this._getIntensityAtPositionBeforeUpdate(position, from, to, 0);
                if (position >= from && position < to) {
                    newIntensity += amount;
                }
            }
            
            // 只保留强度值不为0的边界点（除了最后一个点）
            if (newIntensity !== 0 || i === sortedPoints.length - 1) {
                newBoundaries.push(position);
                newIntensities.push(newIntensity);
            }
        }
        
        // 更新内部状态
        this.boundaries = newBoundaries;
        this.intensities = newIntensities;
    }

    /**
     * Private Function: 获取某点在更新前的强度值
     * 这个方法用于在更新过程中获取某点的原始强度值
     */
    private _getIntensityAtPositionBeforeUpdate(position: number, from: number, to: number, setAmount: number): number {
        // 找到小于等于position的最大边界点
        let maxIndex = -1;
        for (let i = 0; i < this.boundaries.length; i++) {
            if (this.boundaries[i] <= position && (maxIndex === -1 || this.boundaries[i] > this.boundaries[maxIndex])) {
                maxIndex = i;
            }
        }
        
        // 如果找到边界点，返回其强度值；否则返回0
        if (maxIndex === -1) {
            return 0;
        }
        
        // 如果这个边界点在要更新的区间内，需要考虑set操作的影响
        if (position >= from && position < to) {
            return setAmount;
        }
        
        return this.intensities[maxIndex];
    }

    /**
     * Private Function: 获取某点的强度值
     * 通过找到小于等于该点的最大边界点来获取强度值
     */
    private _getIntensityAtPosition(position: number): number {
        // 找到小于等于position的最大边界点
        let maxIndex = -1;
        for (let i = 0; i < this.boundaries.length; i++) {
            if (this.boundaries[i] <= position && (maxIndex === -1 || this.boundaries[i] > this.boundaries[maxIndex])) {
                maxIndex = i;
            }
        }
        
        // 如果找到边界点，返回其强度值；否则返回0
        return maxIndex !== -1 ? this.intensities[maxIndex] : 0;
    }

    /**
     * Private Function: 清除区间内的所有变化值
     * 复杂度：O(k) - k为区间内边界点数量
     */
    private _clearInterval(from: number, to: number): void {
        // 找到区间内的所有边界点
        const indicesToRemove: number[] = [];
        
        for (let i = 0; i < this.boundaries.length; i++) {
            if (this.boundaries[i] >= from && this.boundaries[i] < to) {
                indicesToRemove.push(i);
            }
        }
        
        // 从后往前删除，避免索引变化
        for (let i = indicesToRemove.length - 1; i >= 0; i--) {
            const index = indicesToRemove[i];
            this.boundaries.splice(index, 1);
            this.intensities.splice(index, 1);
        }
    }

    /**
     * Private Function: 计算某点 intensity
     * 复杂度：O(n) - 线性查找前一个边界点
     * 
     * @param target - 目标位置
     * @returns 该位置的强度值
     */
    _calcIntensity(target: number): number {
        // 检查入参
        const validTarget = validatePosition(target);
        if (!validTarget.isValid) {
            throw new Error(`Invalid input: ${validTarget.errors.join(', ')}`);
        }

        return this._getIntensityAtPosition(target);
    }
} 