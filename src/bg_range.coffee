class BGRange

  constructor: (@index, @excluded_boundary) -> 
    BGASSERT((typeof @index != 'undefined') and @excluded_boundary, "missing parameters")
    return this
  clone: -> return new BGRange(@index, @excluded_boundary)

  setIsDone: -> 
    @index = -1; @excluded_boundary = -1
    return this
  addBatchLength: (batch_length) -> 
    BGASSERT(batch_length, "missing parameters")
    @excluded_boundary += batch_length
    return this
  reset:  -> 
    @index = 0
    return this

  isDone:       -> return (@index>=@excluded_boundary)
  step:         -> @index++; return if(@index>=@excluded_boundary) then -1 else @index
  stepToEnd:    -> @index = @excluded_boundary

  sliceArray: (array) -> return array.slice(@index, @excluded_boundary)

  @isARange: (range) ->
    return (range and (typeof range == 'object') and ('constructor' of range) and ('name' of range.constructor) and (range.constructor.name == 'BGRange'))

####################################################
# CommonJS
####################################################
exports.BGRange = BGRange if (typeof exports != 'undefined')
