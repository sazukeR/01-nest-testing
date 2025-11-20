import { sum } from './sum.helper';

describe('Tests on function sum.helper.ts', () => {
  it('should sum two numbers', () => {
    //Arange
    const num1 = 10;
    const num2 = 30;

    // Act
    const result = sum(num1, num2);

    // Assert
    expect(result).toBe(num1 + num2);
  });
});
