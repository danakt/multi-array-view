"use strict";
/**
 * A JavaScript class for fast working with multi-dimensional array through
 * using a flat strided array
 */
var MultiArrayView = /** @class */ (function () {
    /**
     * @param shape List of dimensions lengths
     * @param Constructor The constructor of the array
     * @param [offset=0] The offset to start the view
     * @param [order] Method of data ordering
     */
    function MultiArrayView(array, shape, offset, order) {
        if (offset === void 0) { offset = 0; }
        if (order === void 0) { order = MultiArrayView.C_ORDER; }
        // Checking creating constructor
        if (!(this instanceof MultiArrayView)) {
            throw new TypeError("Constructor MultiArrayView requires 'new'");
        }
        // Validating arguments
        if (!array ||
            shape == null ||
            shape.length === 0 ||
            typeof offset !== 'number') {
            throw new TypeError('invalid arguments');
        }
        this.shape = shape;
        this.length = array.length;
        this.array = array;
        // List of multipliers for calculation an item index. Last multiplier
        // always is 1
        var strides = [1];
        for (var i = shape.length - 1; i >= 0; i--) {
            // If this is the first item, skip the iteration: the length of the
            // first dimension is not required to calculate an item position
            if (i === 0) {
                break;
            }
            if (order === MultiArrayView.F_ORDER) {
                // Row-major order
                strides.push(strides[0] * shape[i]);
            }
            else {
                // Column-major order (default)
                strides.unshift(strides[0] * shape[i]);
            }
        }
        // Since accessing an item with the help of a rest parameter creates an
        // additional array, this method is too slow. For getting and setting items
        // of an array, a function is generated with the specified number of
        // arguments to maintain performance.
        var indexCalculatingCode = (offset !== 0 ? offset + ' + ' : '') +
            strides.map(function (item, i) { return "x" + i + " * " + item; }).join(' + ');
        this.set = new (Function.bind.apply(Function, [void 0, 'value'].concat(shape.map(function (_, i) { return 'x' + i; }), ["this.array[" + indexCalculatingCode + "] = value"])))();
        this.get = new (Function.bind.apply(Function, [void 0].concat(shape.map(function (_, i) { return 'x' + i; }), ["return this.array[" + indexCalculatingCode + "]"])))();
        this.getIndex = new (Function.bind.apply(Function, [void 0].concat(shape.map(function (_, i) { return 'x' + i; }), ["return " + indexCalculatingCode])))();
    }
    /**
     * @param shape List of dimensions lengths
     * @param Constructor The constructor of the array or array-like object
     * @param [offset=0] The offset to start the view
     * @param [order] Method of data ordering
     */
    MultiArrayView.create = function (shape, Constructor, offset, order) {
        if (Constructor === void 0) { Constructor = Array; }
        if (offset === void 0) { offset = 0; }
        if (order === void 0) { order = MultiArrayView.C_ORDER; }
        // Validating arguments
        if (shape == null ||
            shape.length === 0 ||
            Constructor == null ||
            typeof offset !== 'number') {
            throw new TypeError('invalid arguments');
        }
        // Calculation length of the source array
        var length = shape.reduce(function (prev, next) { return prev * next; });
        var array = new Constructor(offset + length);
        return new MultiArrayView(array, shape, offset, order);
    };
    /**
     * Creates the MultiArrayView wrapper around an array or array-like object
     * @param array Array to apply to the MultiArrayView
     * @param shape List of dimensions lengths
     * @param [offset=0] The offset to start the view
     * @param [order] Method of data ordering
     */
    MultiArrayView.wrap = function (array, shape, offset, order) {
        if (offset === void 0) { offset = 0; }
        if (order === void 0) { order = MultiArrayView.C_ORDER; }
        var calculatedLength = shape.reduce(function (a, b) { return a * b; });
        // Checking array length
        if (array.length < calculatedLength + offset) {
            throw new TypeError('Impossible to create the MultiArrayView, because the sum of the length ' +
                'of the array and the offset is greater than the production of ' +
                'the shape.');
        }
        return new MultiArrayView(array, shape, offset, order);
    };
    /**
     * Row-major order constant
     */
    MultiArrayView.C_ORDER = 0;
    /**
     * Column-major order constant
     */
    MultiArrayView.F_ORDER = 1;
    /**
     * Typescript importing fallback
     */
    MultiArrayView.default = MultiArrayView;
    return MultiArrayView;
}());
module.exports = MultiArrayView;
