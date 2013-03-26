class Background.Job
  # functions in the following form with only one function being required at minimum:
  # 1) object:
  # {
  #   start: ->
  #   tick: -> return # true: finished, false: not finished
  #   finish: (was_completed) -> (if not completed, you might want to stop your planned post_execution code)
  # }
  # OR
  # 2) only a tick function
  constructor: (functions) ->
    # legacy interface
    functions = legacyToLatestTask.apply(null, arguments) if (arguments.length>1)
    throw "Missing task functions" unless functions # there was only a tick function passed

    if (typeof(functions) is 'function') # a tick function pass passed instead of an object
      @functions = {tick: functions}
    else
      @functions = {}
      for key, value of functions
        @functions[key] = value
    @was_completed = false

  destroy: ->
    @_cleanup()
    @functions = null

  run: ->
    # set up the job
    if @functions.start
      @functions.start(@)
      @functions.start = null

    # run the functions.tick, if it exists
    @was_completed = if @functions.tick then @functions.tick(@) else true
    @_cleanup() if @was_completed
    return @was_completed

  _cleanup: ->
    # clean up the job
    if @functions.finish
      @functions.finish(@was_completed, @)
      @functions.finish = null