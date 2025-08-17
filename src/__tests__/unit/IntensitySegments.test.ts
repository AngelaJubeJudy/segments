import { IntensitySegments } from '../../IntensitySegments';

describe('IntensitySegments', () => {
    let segments: IntensitySegments;

    beforeEach(() => {
        segments = new IntensitySegments();
    });

    describe('toString() method', () => {
        test('should return segment as valid string', () => {
            segments.add(10, 30, 2);
            const testToString = segments.toString();
            expect(() => JSON.parse(testToString)).not.toThrow();
        });
    });

    describe('add() method', () => {
        test('should return correct with infinite intensity and overlap intervals', () => {
            segments.add(10, 30, 1);
            segments.add(20, 40, 1);
            segments.add(10, 40, -2);
            const testToString = segments.toString();
            expect(testToString).toBe('[[10,-1],[20,0],[30,-1],[40,0]]');
            expect(segments._calcIntensity(25)).toBe(0);
            expect(segments._calcIntensity(15)).toBe(-1);
        });

        test('should return correct with single interval', () => {
            segments.add(10, 11, 1);
            expect(segments._calcIntensity(10)).toBe(1);
            expect(segments._calcIntensity(11)).toBe(0);
        });

        test('should ignore zero intensity', () => {
            segments.add(10, 30, 0);
            const testToString = segments.toString();
            expect(testToString).toBe('[]');
            expect(segments.getLength()).toBe(0);
        });

        test('should return correct with extreme intensity', () => {
            segments.add(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 1);
            expect(segments._calcIntensity(0)).toBe(1);
        });
    });

    describe('set() method', () => {
        test('should return correct with infinite intensity and overlap intervals', () => {
            segments.add(10, 30, 1);
            segments.set(20, 40, -2);
            const testToString = segments.toString();
            expect(testToString).toBe('[[10,1],[20,-2],[40,0]]');
            expect(segments._calcIntensity(10)).toBe(1);
            expect(segments._calcIntensity(15)).toBe(1);
            expect(segments._calcIntensity(20)).toBe(-2);
            expect(segments._calcIntensity(25)).toBe(-2);
            expect(segments._calcIntensity(40)).toBe(0);
        });

        test('should return correct after adding and then setting', () => {
            segments.add(10, 30, 1);
            segments.set(10, 30, 0);
            const testToString = segments.toString();
            expect(testToString).toBe('[]');
            expect(segments._calcIntensity(20)).toBe(0);
            expect(segments.getLength()).toBe(0);
        });
    });

    describe('edge cases', () => {
        test('should handle overlapping intervals correctly', () => {
            segments.add(10, 30, 1);
            segments.add(20, 40, 1);
            const testToString = segments.toString();
            expect(testToString).toBe('[[10,1],[20,2],[30,1],[40,0]]');
            expect(segments._calcIntensity(15)).toBe(1);
            expect(segments._calcIntensity(25)).toBe(2);
            expect(segments._calcIntensity(35)).toBe(1);
        });

        test('should handle negative amounts correctly', () => {
            segments.add(10, 30, 2);
            segments.add(15, 25, -1);
            const testToString = segments.toString();
            expect(testToString).toBe('[[10,2],[15,1],[25,2],[30,0]]');
            expect(segments._calcIntensity(12)).toBe(2);
            expect(segments._calcIntensity(20)).toBe(1);
            expect(segments._calcIntensity(27)).toBe(2);
        });

        test('should handle set operation correctly', () => {
            segments.add(10, 30, 1);
            segments.add(20, 40, 1);
            segments.set(15, 35, 5);
            const testToString = segments.toString();
            expect(testToString).toBe('[[10,1],[15,5],[20,5],[30,5],[35,1],[40,0]]');
            expect(segments._calcIntensity(12)).toBe(1);
            expect(segments._calcIntensity(20)).toBe(5);
            expect(segments._calcIntensity(37)).toBe(5);
        });
    });

});