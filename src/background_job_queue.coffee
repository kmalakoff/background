class Background.JobQueue extends Background._JobContainer

  constructor: (frequency) ->
    super(frequency)
    @current_job = null;

  _doTick: ->
    # get a new job
    if not @current_job
      # no jobs, wait for next push
      if not @jobs.length
        @_waitForJobs()
        return

      # get next job
      @current_job = @jobs.shift()

    # done
    if @current_job.run()
      @current_job.destroy(false)
      @current_job = null 

  push: (init_fn_or_job, run_fn, destroy_fn) -> 
    @_appendJob(init_fn_or_job, run_fn, destroy_fn) 

  _doDestroy: ->
    # destroy the current job
    (@current_job.destroy(true); @current_job = null) if @current_job
    super()
