const MultiArrayView = require('.')

const flattenDeep = arr =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []
  )

const mockShape = [
  (Math.random() * 64 + 1) | 0,
  (Math.random() * 64 + 1) | 0,
  (Math.random() * 64 + 1) | 0
]
const mockLength = mockShape.reduce((a, b) => a * b)
const mockPath = mockShape.map(item => item - 1) // Every last item
const mockNumberValue = 1337
const mockObjectValue = {}

test('should to create MultiArrayView instance by constructor', () => {
  const multiArrayView = new MultiArrayView(Array(mockLength), mockShape)
  expect(multiArrayView.array).toEqual(Array(mockLength))

  expect(() => new MultiArrayView(Array(mockLength))).toThrowError()
  expect(() => MultiArrayView(Array(mockLength), mockShape)).toThrowError()
})

test('should to create MultiArrayView instance by .create() method', () => {
  const multiArrayView = MultiArrayView.create([3, 3, 3], Array)
  expect(multiArrayView.array).toEqual(Array(3 * 3 * 3))
  expect(multiArrayView).toBeInstanceOf(MultiArrayView)

  const multiTypedArray = MultiArrayView.create([3, 3, 3], Int16Array)
  expect(multiTypedArray.array).toEqual(new Int16Array(3 * 3 * 3))

  const multiArrayViewBuffer = MultiArrayView.create([3, 3, 3], ArrayBuffer)
  expect(multiArrayViewBuffer.array).toEqual(new ArrayBuffer(3 * 3 * 3))

  const multiBuffer = MultiArrayView.create([3, 3, 3], Buffer)
  expect(multiBuffer.array).toEqual(new Buffer(3 * 3 * 3))

  expect(() => MultiArrayView.create()).toThrowError()
})

test('should wrap readymade array to MultiArrayView by .wrap()', () => {
  const buffer = Buffer.from(new Uint16Array(mockLength))

  expect(() =>
    MultiArrayView.wrap(buffer, mockShape.map(item => item + 1))
  ).toThrowError()
  expect(() => MultiArrayView.wrap(buffer, mockShape, 1)).toThrowError()

  const multiArrayView = MultiArrayView.wrap(buffer, mockShape)
  expect(multiArrayView).toBeInstanceOf(MultiArrayView)
  expect(multiArrayView.array).toEqual(buffer)
  expect(multiArrayView.length).toEqual(mockLength)
})

test('getting the real index', () => {
  const arr = Array(mockShape[0])
    .fill(null)
    .map(() =>
      Array(mockShape[1])
        .fill(null)
        .map(() => Array(mockShape[2]).fill(0))
    )

  arr[mockPath[0]][mockPath[1]][mockPath[2]] = mockNumberValue

  const flattenArray = flattenDeep(arr)
  const multiArrayView = MultiArrayView.wrap(flattenArray, mockShape)
  const realIndex = multiArrayView.getIndex(...mockPath)

  expect(realIndex).toBe(mockLength - 1)
  expect(realIndex).toBe(multiArrayView.length - 1)
  expect(multiArrayView.array[realIndex]).toBe(mockNumberValue)
})

test('setting a value', () => {
  const multiArrayView = MultiArrayView.create(mockShape, ArrayBuffer)
  multiArrayView.set(mockNumberValue, ...mockPath)

  const realIndex = multiArrayView.getIndex(...mockPath)

  expect(multiArrayView.array[realIndex]).toBe(mockNumberValue)
})

test('getting a value', () => {
  const arr = Array(mockShape[0])
    .fill(null)
    .map(() =>
      Array(mockShape[1])
        .fill(null)
        .map(() => Array(mockShape[2]).fill(0))
    )

  arr[mockPath[0]][mockPath[1]][mockPath[2]] = mockObjectValue

  const flattenArray = flattenDeep(arr)
  const multiArrayView = MultiArrayView.wrap(flattenArray, mockShape)
  const obtainedValue = multiArrayView.get(...mockPath)

  expect(obtainedValue).toBe(mockObjectValue)
})

test('should fill array', () => {
  const shape = [3, 3, 3]
  const simpleNestedArray = []
  const multiArrayView = MultiArrayView.create(shape)

  for (let x = 0; x < shape[0]; x++) {
    simpleNestedArray[x] = []
    for (let y = 0; y < shape[1]; y++) {
      simpleNestedArray[x][y] = []
      for (let z = 0; z < shape[2]; z++) {
        const value = x * y * z

        simpleNestedArray[x][y][z] = value
        multiArrayView.set(value, x, y, z)
      }
    }
  }

  expect(multiArrayView.array).toEqual(flattenDeep(simpleNestedArray))
})

test('should create multiarrayView with offset', () => {
  const offset = 3
  const multiArrayView = MultiArrayView.create(mockShape, Uint8Array, offset)

  expect(multiArrayView.array.length).toBe(mockLength + offset)
})

test('test ordering methods', () => {
  const sourceData = [[0, 8, 4], [5, 3, 5], [2, 3, 6]]

  const shape = [3, 3]

  const cOrderedArray = MultiArrayView.create(shape, Uint8Array)
  const fOrderedArray = MultiArrayView.create(
    shape,
    Uint8Array,
    0,
    MultiArrayView.F_ORDER
  )

  for (let x = 0; x < shape[0]; x++) {
    for (let y = 0; y < shape[1]; y++) {
      cOrderedArray.set(sourceData[x][y], x, y)
      fOrderedArray.set(sourceData[x][y], x, y)
    }
  }

  expect(cOrderedArray.array).toEqual(
    new Uint8Array([0, 8, 4, 5, 3, 5, 2, 3, 6])
  )
  expect(fOrderedArray.array).toEqual(
    new Uint8Array([0, 5, 2, 8, 3, 3, 4, 5, 6])
  )
})
