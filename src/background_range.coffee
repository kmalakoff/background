class BGRange

  constructor: (@index, @excluded_boundary) -> 
    BGASSERT((typeof @index != 'undefined') and @excluded_boundary, "missing parameters")
    return this

  isDone:             -> return (@index>=@excluded_boundary)
  step:               -> @index++; return if(@index>=@excluded_boundary) then -1 else @index
  getItem: (array)    -> return array[@index]
  getSlice: (array) -> return array.slice(@index, @excluded_boundary)

  _setIsDone: -> 
    @index = -1; @excluded_boundary = -1
    return this
  _addBatchLength: (batch_length) -> 
    BGASSERT(batch_length, "missing parameters")
    @excluded_boundary += batch_length
    return this
  reset: -> 
    @index = 0
    return this
  _stepToEnd:    -> @index = @excluded_boundary

####################################################
# CommonJS
####################################################
exports.BGRange = BGRange if (typeof exports != 'undefined')
