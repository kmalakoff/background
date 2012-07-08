class Background.Range

  constructor: (@index, @excluded_boundary) ->
    throw "Background.Range: parameters invalid" if (@index == undefined) or not @excluded_boundary
    return this

  isDone:             -> return (@index>=@excluded_boundary)
  step:               -> @index++; return if (@index>=@excluded_boundary) then -1 else @index
  getItem: (array)    -> return array[@index]
  getSlice: (array) -> return array.slice(@index, @excluded_boundary)

  _setIsDone: ->
    @index = -1; @excluded_boundary = -1
    return this
  _addBatchLength: (batch_length) ->
    throw "Background.Range._addBatchLength: batch_length invalid" if not batch_length
    @excluded_boundary += batch_length
    return this
  reset: ->
    @index = 0
    return this
  _stepToEnd:    -> @index = @excluded_boundary
