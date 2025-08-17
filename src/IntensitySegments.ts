import { Segment } from './types/index';
import { validateInput, validatePosition } from './utils/validator';
import { INTENSITY_CONSTANTS } from './constants/index';

/**
 * 【数据结构】区间强度管理：每个边界点记录从该点开始的强度值
 * 
 * 【核心思想】每个边界点仅记录从该点开始的强度值
 * 当某点的强度变为0时，该边界点被删除（除了最后一个点）
 */
export class IntensitySegments {
    // 有序数组存储边界，每个点记录从该点开始的强度值
    private boundaries: number[] = [];
    private intensities: number[] = [];
    
    constructor() {}

    /**
     * Private Function: 搜索最大边界点
     * 复杂度：O(log n) - 二分查找
     * 
     * @param target - 目标位置
     * @returns 最大下边界点索引，没找到则返回 -1
     */
    private _binarySearchBoundary(target: number): number {
        if (this.boundaries.length === 0) {
            return -1;
        }

        let left = 0;
        let right = this.boundaries.length - 1;
        let result = -1;  // 初始化

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (this.boundaries[mid] <= target) {
                result = mid;
                left = mid + 1; // 继续搜索
            } else {
                right = mid - 1;
            }
        }

        return result;
    }

    /**
     * Private Function: 搜索插入位置
     * 复杂度：O(log n) - 二分查找
     * 
     * @param target - 目标位置
     * @returns 应该插入的位置索引
     */
    private _binarySearchPosition(target: number): number {
        if (this.boundaries.length === 0) {
            return 0;
        }

        let left = 0;
        let right = this.boundaries.length;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            if (this.boundaries[mid] < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left;
    }

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
     * segments.add(20, 40, 1);  // 在[20,40)上增加强度1，输出 "[[10, 1], [20, 2], [30, 1], [40, 0]]"
     * segments.add(10, 40, -2);  // 在[10,40)上减少强度2，输出 "[[10, -1], [20, 0], [30, -1], [40, 0]]"
     * ```
     * 
     * ```typescript
     * segments2.toString(); // should be "[]"
     * segments.add(10, 30, 1);  // 在[10,30)上增加强度1，输出 "[[10, 1], [30, 0]]"
     * segments.add(20, 40, 1);  // 在[20,40)上增加强度1，输出 "[[10, 1], [20, 2], [30, 1], [40, 0]]"
     * segments2.add(10, 40, -1);  // 在[10,40)上减少强度1，输出 "[[20, 1], [30, 0]]"
     * segments2.add(10, 40, -1);  // 在[10,40)上减少强度1，输出 "[[10, -1], [20, 0], [30, -1], [40, 0]]"
     * ```
     */
    add(from: number, to: number, amount: number): void {
        // 检查入参
        const validInput = validateInput(from, to, amount);  //复杂度：O(1)
        if (!validInput.isValid) {
            throw new Error(`Invalid input: ${validInput.errors.join(', ')}`);
        }

        // 不变化，不计算
        if (amount === INTENSITY_CONSTANTS.ZERO_INTENSITY) {
            return;
        }

        // 更新区间内的强度值
        this._updateInterval(from, to, amount, false);  //复杂度：O(n log n)
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
        const validInput = validateInput(from, to, amount);  //复杂度：O(1)
        if (!validInput.isValid) {
            throw new Error(`Invalid input: ${validInput.errors.join(', ')}`);
        }

        // step 1：清除目标区间内之前变化
        this._clearInterval(from, to);  //复杂度：O(log n + k)
        
        // step 2：设置新值
        if (amount !== INTENSITY_CONSTANTS.ZERO_INTENSITY) {
            this._updateInterval(from, to, amount, true);  //复杂度：O(n log n)
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
     * 复杂度：O(n log n) - 收集边界点 + 排序 + 二分搜索计算强度值
     */
    private _updateInterval(from: number, to: number, amount: number, isSet: boolean): void {
        const pointsToProcess = new Set<number>();
        pointsToProcess.add(from);
        pointsToProcess.add(to);
        
        // 添加边界
        for (let i = 0; i < this.boundaries.length; i++) {
            pointsToProcess.add(this.boundaries[i]);
        }
        const sortedPoints = Array.from(pointsToProcess).sort((a, b) => a - b);
        
        // 重新计算每个边界点的强度值
        const newBoundaries: number[] = [];
        const newIntensities: number[] = [];
        
        for (let i = 0; i < sortedPoints.length; i++) {
            const position = sortedPoints[i];
            let newIntensity: number;
            
            if (isSet) {
                // 【set操作】计算新强度值
                if (position >= from && position < to) {
                    newIntensity = amount;  // 更新
                } else {
                    // 需要找到该点之前的强度值
                    newIntensity = this._getIntensityAtPositionBeforeUpdate(position, from, to, isSet, amount);
                }
            } else {
                // 【add操作】计算统计强度值
                newIntensity = this._getIntensityAtPositionBeforeUpdate(position, from, to, isSet, 0);
                if (position >= from && position < to) {
                    newIntensity += amount;  // 更新
                }
            }
            
            newBoundaries.push(position);
            newIntensities.push(newIntensity);
        }

        // 【上下边界处理】只保留强度值不为0的边界点（除了上边界）：（1）非零，（2）零值但上边界。
        const filteredBoundaries: number[] = [];
        const filteredIntensities: number[] = [];
        
        let headBoundaryIndex = -1;
        let lastNonZeroIndex = -1;
        
        // 单次 O(n) 遍历：同时找到头边界、最后一个非0值尾边界
        for (let i = 0; i < newIntensities.length; i++) {
            const currentIntensity = newIntensities[i];
            
            // 找到索引：头边界，最后一个非0值尾边界
            if (currentIntensity !== 0) {
                if (headBoundaryIndex === -1) {
                    headBoundaryIndex = i;  // 找到为止
                }
                lastNonZeroIndex = i;
            }
            
            // 都是非零，则尾节点就是最后一个；有多个零值结尾，则尾节点是顺序第一个零值点
            const tailBoundaryIndex = lastNonZeroIndex !== -1 ? lastNonZeroIndex + 1 : newIntensities.length - 1;
            
            // 判断是否保留当前点：头节点，尾节点，头尾之间所有节点
            const shouldKeep = i === headBoundaryIndex || i === tailBoundaryIndex || (i > headBoundaryIndex && i < tailBoundaryIndex);
            if (shouldKeep) {
                // 根据规则：只保留强度值不为0的边界点（除了上边界）
                const currentIntensity = newIntensities[i];
                const isLastPoint = i === newIntensities.length - 1;
                const isTailBoundary = i === tailBoundaryIndex;
                
                // 保留强度值不为0的点，或者尾边界点（上边界）
                if (currentIntensity !== 0 || isTailBoundary || isLastPoint) {
                    filteredBoundaries.push(newBoundaries[i]);
                    filteredIntensities.push(newIntensities[i]);
                }
            }
        }
        
        this.boundaries = filteredBoundaries;
        this.intensities = filteredIntensities;
    }

    /**
     * Private Function: 获取某点在更新前的强度值（用于 add 或 set 操作）
     * 复杂度：O(log n) - 二分搜索
     */
    private _getIntensityAtPositionBeforeUpdate(position: number, from: number, to: number, isSet: boolean, setAmount: number): number {
        
        const maxIndex = this._binarySearchBoundary(position);  //复杂度：O(logn)
        // let maxIndex = -1;

        // // 边界范围：boundaries[i] ≤ position ≤ boundaries.length - 1
        // for (let i = 0; i < this.boundaries.length; i++) {
        //     if (this.boundaries[i] <= position && (maxIndex === -1 || this.boundaries[i] > this.boundaries[maxIndex])) {
        //         maxIndex = i;
        //     }
        // }
        
        // 没找到最小边界：返回强度初始值
        if (maxIndex === -1) {
            return INTENSITY_CONSTANTS.INITIAL_INTENSITY;
        }
        
        // 找到了最小边界，且这个边界在[from, to)更新区间内：考虑 set 重置操作的关联影响
        if (position >= from && position < to) {
            if (isSet) {
                return setAmount;
            } else {
                return this.intensities[maxIndex];
            }
        }
        
        // 找到了最小边界，且不受外部操作影响：返回最小边界位置的强度值
        return this.intensities[maxIndex];
    }

    /**
     * Private Function: 获取某点的强度值
     * 操作：通过找到小于等于该点的最大边界点来获取强度值
     * 原理：某一点的强度值，取决于其所在边界范围（interval）
     * 复杂度：O(log n) - 二分搜索
     */
    private _getIntensityAtPosition(position: number): number {
        let maxIndex = this._binarySearchBoundary(position);  //复杂度：O(logn)

        // let maxIndex = -1;

        // // 从左到右遍历边界点位置，找到顺序位置“≤”该点的最大边界
        // // 索引范围：-1 ≤ maxIndex ≤ boundaries.length - 1
        // // 边界范围：boundaries[i] ≤ position ≤ boundaries.length - 1
        // for (let i = 0; i < this.boundaries.length; i++) {
        //     if (this.boundaries[i] <= position && (maxIndex === -1 || this.boundaries[i] > this.boundaries[maxIndex])) {
        //         maxIndex = i;
        //     }
        // }
        
        // 找到边界，返回强度、否则返回 0（默认值）
        return maxIndex !== -1 ? this.intensities[maxIndex] : INTENSITY_CONSTANTS.INITIAL_INTENSITY;
    }

    /**
     * Private Function: 清除区间内的所有变化值
     * 复杂度：O(log n + k) - 二分搜索边界 + 删除操 k 个元素
     */
    private _clearInterval(from: number, to: number): void {
        // const indicesToRemove: number[] = [];
        
        // // 找到目标区间
        // for (let i = 0; i < this.boundaries.length; i++) {
        //     if (this.boundaries[i] >= from && this.boundaries[i] < to) {
        //         indicesToRemove.push(i);
        //     }
        // }
        
        // // 数组动态特性处理：从后往前删除，避免过程中引起的索引变化
        // for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        //     const index = indicesToRemove[i];
        //     // 删除 index 位置的 1 个元素
        //     this.boundaries.splice(index, 1);
        //     this.intensities.splice(index, 1);
        // }

        const startIndex = this._binarySearchPosition(from);
        const endIndex = this._binarySearchPosition(to);
        
        // 改进点：批量删除
        if (startIndex < endIndex) {
            this.boundaries.splice(startIndex, endIndex - startIndex);
            this.intensities.splice(startIndex, endIndex - startIndex);
        }
    }

    /**
     * Private Function: 计算某点 intensity
     * 复杂度：O(n) - 线性查找前一个边界点
     * 
     * @param target - 目标位置
     * @returns 该位置的强度值
     */
    /**
     * Private Function: 计算某点 intensity
     * 复杂度：O(log n) - 二分搜索
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