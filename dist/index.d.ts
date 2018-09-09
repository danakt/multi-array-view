/**
 * Type of array or array-like constructor
 */
interface ArrayLikeConstructor<T> {
    new (length: number): ArrayLike<T>;
}
/**
 * A JavaScript class for fast working with multi-dimensional array through
 * using a flat strided array
 */
declare class MultiArrayView<T> {
    /**
     * Row-major order constant
     */
    static C_ORDER: number;
    /**
     * Column-major order constant
     */
    static F_ORDER: number;
    /**
     * Typescript importing fallback
     */
    static default: typeof MultiArrayView;
    /**
     * @param shape List of dimensions lengths
     * @param Constructor The constructor of the array or array-like object
     * @param [offset=0] The offset to start the view
     * @param [order] Method of data ordering
     */
    static create<T>(shape: number[], Constructor?: ArrayLikeConstructor<T>, offset?: number, order?: number): MultiArrayView<T>;
    /**
     * Creates the MultiArrayView wrapper around an array or array-like object
     * @param array Array to apply to the MultiArrayView
     * @param shape List of dimensions lengths
     * @param [offset=0] The offset to start the view
     * @param [order] Method of data ordering
     */
    static wrap<T>(array: ArrayLike<T>, shape: number[], offset?: number, order?: number): MultiArrayView<T>;
    /**
     * The source array
     */
    array: ArrayLike<T>;
    /**
     * The length of the source array
     */
    length: number;
    /**
     * List of dimensions lengths
     */
    shape: number[];
    /**
     * Sets a value to the array by path
     * @param value Value to set
     * @param path Path of the item to set the value
     */
    set: (value: T, ...path: number[]) => void;
    /**
     * Returns a value from the array
     * @param path Item path to get the value
     * @returns The value that we got
     */
    get: (...path: number[]) => T;
    /**
     * Returns the real index of the item by path
     */
    getIndex: (...path: number[]) => T;
    /**
     * @param shape List of dimensions lengths
     * @param Constructor The constructor of the array
     * @param [offset=0] The offset to start the view
     * @param [order] Method of data ordering
     */
    constructor(array: ArrayLike<T>, shape: number[], offset?: number, order?: number);
}
declare namespace MultiArrayView {
}
export = MultiArrayView;
