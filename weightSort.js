// weightSort(arr, [weightKey])
// Parameters:
// arr ... an array of form [ [ weight, var], ... ]
//         [ [ -3, A ], [ -1, B ], [ 5, C ], [ -1, D ] ]
//         OR
//         an array of form [ { 'weight': value, other key/values } ]
//         [ { 'weight': -3, k: A ], { 'weight': -1, v: B }, [ 5, C ] ]
//         OR
//         an object of form { 'index': {'weight': value, other key/values }, ... }
//         (please note that numerical indexes won't work)
//
// weightKey ... name of the key which holds each element's weight (default:
//                'weight')
//
//  as the last item shows, you can even mix the forms
//
// Returns:
// if the first form is used, only the 'var' will be returned; with the
// second form the elements are untouched, only their position changed.
//
// Notes:
// Entries in the source array with the same weight are returned in the
// same order
// * weight might be a function closure
function weightSort (arr, weightKey) {
  function numericalCmp (a, b) {
    if (a === b) {
      return 0
    }

    return parseFloat(a) < parseFloat(b) ? -1 : 1
  }

  var i
  var j
  var ret1 = {}
  if (!weightKey) {
    weightKey = 'weight'
  }

  // check if input array is an object, convert to array
  var isObject = false
  if (typeof arr.length === 'undefined') {
    var newArr = []
    isObject = true

    for (i in arr) {
      arr[i].__weightSort_index = i
      newArr.push(arr[i])
    }

    arr = newArr
  }

  // first put all elements into an assoc. array
  for (i = 0; i < arr.length; i++) {
    var cur = arr[i]
    var wgt
    var data

    if (cur.length) {
      wgt = cur[0]
      data = cur[1]
    } else {
      wgt = cur[weightKey]
      data = cur
    }

    if (typeof wgt === 'function') {
      wgt = wgt()
    }

    if (!wgt) {
      wgt = 0
    }

    if (!ret1[wgt]) {
      ret1[wgt] = []
    }

    ret1[wgt].push(data)
  }

  // get the keys, convert to value, order them
  var keys1 = []
  for (var k in ret1) {
    keys1.push(k)
  }
  keys1.sort(numericalCmp)
  var ret2 = []

  // iterate through array and compile final return value
  for (i = 0; i < keys1.length; i++) {
    for (j = 0; j < ret1[keys1[i]].length; j++) {
      ret2.push(ret1[keys1[i]][j])
    }
  }

  // rebuild object if necessary
  if (isObject) {
    newArr = {}
    for (i = 0; i < ret2.length; i++) {
      var ob = ret2[i]

      var index = ob.__weightSort_index
      delete ob.__weightSort_index

      newArr[index] = ob
    }

    ret2 = newArr
  }

  return ret2
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = weightSort
}
if (typeof window !== 'undefined') {
  window.weightSort = weightSort
  window.weight_sort = weightSort // legacy
}
