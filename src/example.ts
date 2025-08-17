
/**
 * [Problem Set]
 * Segments are intervals from -infinity to infinity. 
 * Implement 3 functions that update intensity by a integer for a given range. 
 * All intensity starts with 0. 
 */

import { IntensitySegments } from "./IntensitySegments";

/**
 * [Requirements]
 * 1. Codes 整体要求：simple, clean, readable and maintainable，以及 your mastery of idiomatic programming.
 * 2. Code organization and submission format: things like code organization, readability, documentation, testing and deliverability are most important here.
 * 3. 整体 solution 需要：体现 how you write production quality code in a team setting where multiple developers will be collaborating on the codebase.
 * 4. Solution is preferred to be in Typescript (modern TS and best practices). 
 * 5. 时间复杂度要求：O(n).
 */

// export class IntensitySegments{
//      /**
//      * @param from starts the interval
//      * @param to ends the interval
//      */
//     add(_from: any, _to: any, _amount: any){
//         // TODO 1
//     }
//     set(_from: any, _to: any, _amount: any){
//         // TODO 2
//     }
//     toString(){
//         // TODO 3
//     }
// }

// (data stored as an array of start point and value for each segment)

console.log("--------Example 1--------");
// sample sequence 1:
const segments = new IntensitySegments();
console.log("初始状态:", segments.toString());  // should be "[]"

segments.add(10, 30, 1);
 // should be "[[10, 1], [30, 0]]"
console.log("添加 [10,30) 强度 1:", segments.toString());

segments.add(20, 40, 1);
// should be "[[10, 1], [20, 2], [30, 1], [40, 0]]"
console.log("添加 [20,40) 强度 1:", segments.toString());

segments.add(10, 40, -2);
// should be "[[10, -1], [20, 0], [30, -1], [40, 0]]"
console.log("添加 [10,40) 强度 -2:", segments.toString());


console.log("--------Example 2--------");
// sample sequence 2:
const segments2 = new IntensitySegments();
console.log("初始状态:", segments2.toString());  // should be "[]"

segments2.add(10, 30, 1);
// should be "[[10, 1], [30, 0]]"
console.log("添加 [10,30) 强度 1:", segments2.toString());

segments2.add(20, 40, 1);
// should be "[[10, 1], [20, 2], [30, 1], [40, 0]]"
console.log("添加 [20,40) 强度 1:", segments2.toString());

segments2.add(10, 40, -1);
// should be "[[20, 1], [30, 0]]"
console.log("添加 [10,40) 强度 -1:", segments2.toString());

segments2.add(10, 40, -1);
// should be "[[10, -1], [20, 0], [30, -1], [40, 0]]"
console.log("添加 [10,40) 强度 -1:", segments2.toString());
