class BGRange

  constructor: (@index, @excluded_boundary) -> return this
  clone: -> return new BGRange(@index, @excluded_boundary)

  setIsDone: -> 
    @index = -1; @excluded_boundary = -1
    return this
  set: (index_or_range, excluded_boundary) -> 
    if(BGRange.isARange(index_or_range))
      @index = index_or_range.index; @excluded_boundary = index_or_range.excluded_boundary
    else
      @index = index_or_range; @excluded_boundary = excluded_boundary
    return this

  step:   -> @index++; return if(@index>=@excluded_boundary) then -1 else @index
  isDone: -> return (@index>=@excluded_boundary)

  sliceArray: (array) -> return array.slice(@index, @excluded_boundary)

  @isARange: (range) ->
    return (range and (typeof range == 'object') and ('constructor' of range) and ('name' of range.constructor) and (range.constructor.name == 'BGRange'))

####################################################
# CommonJS
####################################################
exports.BGRange = BGRange if (typeof exports != 'undefined')
