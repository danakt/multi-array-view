/**
 * Type of array or array-like constructor
 */
interface ArrayLikeConstructor<T> {
  new (length: number): ArrayLike<T>
}

/**
 * A JavaScript class for fast working with multi-dimensional array through
 * using a flat strided array
 */
class MultiArrayView<T> {
  /**
   * Typescript importing fallback
   */
  public static default = MultiArrayView

  /**
   * @param shape List of dimensions lengths
   * @param Constructor The constructor of the array or array-like object
   * @param [offset=0] The offset to start the view
   */
  public static create<T>(
    shape: number[],
    Constructor: ArrayLikeConstructor<T> = Array,
    offset: number = 0
  ) {
    // Validating arguments
    if (
      shape == null ||
      shape.length === 0 ||
      Constructor == null ||
      typeof offset !== 'number'
    ) {
      throw new TypeError('invalid arguments')
    }

    // Calculation length of the source array
    const length = shape.reduce((prev, next) => prev * next)
    const array: ArrayLike<T> = new Constructor(offset + length)

    return new MultiArrayView<T>(array, shape, offset)
  }

  /**
   * Creates the MultiArrayView wrapper around an array or array-like object
   * @param array Array to apply to the MultiArrayView
   * @param shape List of dimensions lengths
   * @param [offset=0] The offset to start the view
   */
  public static wrap<T>(
    array: ArrayLike<T>,
    shape: number[],
    offset: number = 0
  ) {
    const calculatedLength: number = shape.reduce((a, b) => a * b)

    // Checking array length
    if (array.length < calculatedLength + offset) {
      throw new TypeError(
        'Impossible to create the MultiArrayView, because the sum of the length ' +
          'of the array and the offset is greater than the production of ' +
          'the shape.'
      )
    }

    return new MultiArrayView<T>(array, shape, offset)
  }

  /**
   * The source array
   */
  public array: ArrayLike<T>

  /**
   * The length of the source array
   */
  public length: number

  /**
   * List of dimensions lengths
   */
  public shape: number[]

  /**
   * Sets a value to the array by path
   * @param value Value to set
   * @param path Path of the item to set the value
   */
  public set: (value: T, ...path: number[]) => void

  /**
   * Returns a value from the array
   * @param path Item path to get the value
   * @returns The value that we got
   */
  public get: (...path: number[]) => T

  /**
   * Returns the real index of the item by path
   */
  public getIndex: (...path: number[]) => T
  /**
   * @param shape List of dimensions lengths
   * @param Constructor The constructor of the array
   * @param [offset=0] The offset to start the view
   */
  public constructor(array: ArrayLike<T>, shape: number[], offset: number = 0) {
    // Checking creating constructor
    if (!(this instanceof MultiArrayView)) {
      throw new TypeError("Constructor MultiArrayView requires 'new'")
    }

    // Validating arguments
    if (
      !array ||
      shape == null ||
      shape.length === 0 ||
      typeof offset !== 'number'
    ) {
      throw new TypeError('invalid arguments')
    }

    this.shape = shape
    this.length = array.length
    this.array = array

    // List of multipliers for calculation an item index. Last multiplier
    // always is 1
    const strides: number[] = [1]

    for (let i = shape.length - 1; i >= 0; i--) {
      // If this is the first item, skip the iteration: the length of the
      // first dimension is not required to calculate an item position
      if (i === 0) {
        break
      }

      strides.unshift(strides[0] * shape[i])
    }

    // Since accessing an item with the help of a rest parameter creates an
    // additional array, this method is too slow. For getting and setting items
    // of an array, a function is generated with the specified number of
    // arguments to maintain performance.
    const indexCalculatingCode =
      (offset !== 0 ? offset + ' + ' : '') +
      strides.map((item, i) => `x${i} * ${item}`).join(' + ')

    this.set = new Function(
      'value',
      ...shape.map((_, i) => 'x' + i),
      `this.array[${indexCalculatingCode}] = value`
    ) as any

    this.get = new Function(
      ...shape.map((_, i) => 'x' + i),
      `return this.array[${indexCalculatingCode}]`
    ) as any

    this.getIndex = new Function(
      ...shape.map((_, i) => 'x' + i),
      `return ${indexCalculatingCode}`
    ) as any
  }
}

// Exporting module also as namespace to fix following error during importing
// the module: "Module resolves to a non-module entity and cannot be imported
// using this construct.""
namespace MultiArrayView {
  // Nothing here
}

// Exporting the class
export = MultiArrayView
