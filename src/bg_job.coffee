class BGJob
  # 1) init_fn: () -> 
  # 2) run_fn: () -> return true when finished and so will be destroyed
  # 3) destroy_fn: (was_completed) -> 
  #     (if not completed, you might want to stop your planned post_execution code)
  constructor: (@init_fn, @run_fn, @destroy_fn) ->
    throw new Error('run_fn is mandatory') if not @run_fn
    @was_completed = false

  destroy: ->
    @_cleanup()
    @run_fn = null 
    @init_fn = null
    @destroy_fn = null

  run: ->
    # set up the job
    if @init_fn
      try
        @init_fn() 
      catch error
        BGASSERT(null, "init_fn failed because of '#{error.message}'")
        return true
      @init_fn = null

    # run the run_fn
    try
      @was_completed = @run_fn()
    catch error
      BGASSERT(null, "run_fn failed because of '#{error.message}'")

    @_cleanup() if(@was_completed)
    return @was_completed

  _cleanup: ->
    # clean up the job
    if @destroy_fn
      try
        @destroy_fn(@was_completed) 
      catch error
        BGASSERT(null, "init_fn failed because of '#{error.message}'")
      @destroy_fn = null

  @isAJob: (job) ->
    return (job and (typeof job == 'object') and ('constructor' of job) and ('name' of job.constructor) and (job.constructor.name == 'BGJob'))

####################################################
# CommonJS
####################################################
exports.BGJob = BGJob if (typeof exports != 'undefined')