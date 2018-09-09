# MultiArrayView [![NPM](https://img.shields.io/npm/v/multi-array-view.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/multi-array-view) [![Build Status](https://img.shields.io/travis/danakt/multi-array-view.svg?style=flat-square&maxAge=3600)](https://travis-ci.org/danakt/multi-array-view)

<img align="right" width="150" src="https://cdn.rawgit.com/danakt/multi-array-view/74507769/octaplex.svg" title="Octaplex">

A small JavaScript library for efficient work with multidimensional arrays.

When working with a large data, (for example, in 3d-graphics), working with nested arrays in JavaScript can affect the performance of the code. The more productive analogy of nested arrays is strided arrays—multidimensional data placed in the plane of a one-dimensional array. Unfortunately, working with strided arrays can lead to code repetition, complex operations, and syntactic noise in the code. The MultiArrayView library serves to simplify the work with strided arrays as if it were an ordinary multidimensional array.

A simple 3x3 matrix:

```js
const array = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 1]
]

const item = arr[2][2] // 1
```

And a similar 3x3 matrix in the form of a one-dimensional strided array wrapped in MultiArrayView:

```js
const array = [
  0, 0, 0,
  0, 0, 0,
  0, 0, 1
]

// Wrapping the strided array
const multiArray = MultiArrayView.wrap(arr, [3, 3])

const unit = multiArray.get(2, 2) // 1
```

## Getting Started

Installation using npm:

```
$ npm install multi-array-view
```

Or using yarn:

```
$ yarn add multi-array-view
```

### Usage

You can import the package in your node.js-project the following way:

```js
const MultiArrayView = require('multi-array-view')
```

If your project has ES6 or TypeScript support, use the following import method. The MultiArrayView has full typing support.

```js
import MultiArrayView from 'multi-array-view'
```

## API reference

### Static methods

#### `MultiArrayView.create(shape[, constructor, offset])`
Creates a new array using the specified constructor. If the constructor is not specified, the `Array` is used as the constructor. Returns instance of MultiArrayView class.

- `shape`  
List of array dimensions.
  
- `constructor` _Optional_  
Constructor for creating the source one-dimensional array.  
Defaults to `Array`.

- `offset` _Optional_   
The starting offset of the array view.  
Defaults to 0.

A minimal example
```js
// Creates empty 4x4 matrix
const multiArray = MultiArrayView.create([4, 4])

console.log(multiArray.array) // (16) [empty × 16] 

```

With specified `constructor` and `offset`
```js
const multiArray = MultiArrayView.create([4, 4], Uint8Array, 2)

console.log(multiArray.array)
// Uint8Array(18) [
//   0, 0,          <— 2 offseted items
//   0, 0, 0, 0,    <— matrix start
//   0, 0, 0, 0,
//   0, 0, 0, 0,
//   0, 0, 0, 0
// ]
```

#### `MultiArrayView.wrap(array, shape[, offset])`
Wraps the readymade strided array in the MultiArrayView class for multi-dimensional viewing. Returns instance of MultiArrayView class.

- `array`  
The 1d array to wrap.

- `shape`  
List of array dimensions.

- `offset` _Optional_   
The starting offset of the array view.  
Defaults to 0.

Simple example
```js
const shape = [128, 256, 512]
const length = shape.reduce((a, b) => a * b) // Calculation the length of the array
const typedArray = new Int32Array(length) 

// Wrapping the array
const multiArray = MultiArrayView.wrap(typedArray, shape) 

console.log(multiArray.array) // Int32Array(16777216) [0, 0, 0, 0, 0, ...
```

### Instance methods

#### `.get(x1 [, x2, ..., xN])`
Returns the value of the item by the specified path.

- `x1` ... `xN`  
 List of indices for each dimension to obtain an item. The same as indices in a simple multidimensional array.


#### `.set(value, x1 [, x2, ..., xN])`
Sets the item value by the specified path.

- `value`  
The value to set

- `x1` ... `xN`  
List of indices for each dimension to set a value to the item. The same as indices in a simple multidimensional array.

Example
```js
const multiArray = MultiArrayView.create([100, 100])

const value = 1337
multiArray.set(value, 90, 10)

console.log(multiArray.get(90, 10)) // 1337
```

#### `.getIndex(x1 [, x2, ..., xN])`
Returns the real index of source array by the specified path.

- `x1` ... `xN`  
List of indices for each dimension to get the real index. The same as indices in a simple multidimensional array.

#### `.array`
The source array.

#### `.shape`
Shape of the array that was putted when the MultiArrayView instance was created.

#### `.length`
Length of the source array computed by the shape.