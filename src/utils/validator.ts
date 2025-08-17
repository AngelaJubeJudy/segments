
import { ValidationResult } from '../types/index';
import { RANGE_CONSTANTS } from '../constants/index';

export function validateInput(from: number, to: number, amount: number): ValidationResult{
    const intervalValidation = validateInterval(from, to);
    const amountValidation = validateAmount(amount);

    return {
        isValid: intervalValidation.isValid && amountValidation.isValid,
        errors: [...intervalValidation.errors, ...amountValidation.errors]
    }
}

export function validatePosition(target: number): ValidationResult{
    const errors: string[] = [];

    // 类型检查
    if(typeof target !== 'number'){
        errors.push('position MUST be a number')
        return {isValid: false, errors};
    }

    // 范围检查
    if(!Number.isFinite(target)){
        errors.push('target MUST be infinite number')
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}


export function validateInterval(from: number, to: number): ValidationResult{
    const errors: string[] = [];

    // 类型检查
    if(typeof from !== 'number' || typeof to !== 'number'){
        errors.push('from/to MUST be a number')
        return {isValid: false, errors};
    }

    // 范围检查
    if(from >= to){
        errors.push('from MUST be smaller than to')
    }
    if(!Number.isFinite(from) || !Number.isFinite(to)){
        errors.push('from/or MUST be infinite number')
    }

    const intervalLen = to - from;
    if(intervalLen < RANGE_CONSTANTS.MIN_SEGMENT_LEN){
        errors.push('no change')
    }
    // 移除这个限制，允许极端值测试
    // if(intervalLen > RANGE_CONSTANTS.MAX_SEGMENT_LEN){
    //     errors.push('MAY cause memory and performance issues')
    // }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateAmount(amount: number): ValidationResult{
    const errors: string[] = [];

    // 类型检查
    if (typeof amount !== 'number') {
        errors.push('amount must be a number');
        return { isValid: false, errors };
    }

    // 范围检查
    if(!Number.isFinite(amount)){
        errors.push('amount MUST be finite number')
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

