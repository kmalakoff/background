class Background.JobList extends Background._JobContainer

  constructor: (frequency) ->
    super(frequency)

  _doTick: ->
    # no jobs, wait for next append
    if not @jobs.length
      @_waitForJobs()
      return

    # process all jobs -> copy the jobs in case new ones are appended mid-processing (newly appended jobs will be processed next tick)
    jobs = @jobs.slice()
    for job in jobs
      continue if not job.run()

      # done so destroy and remove from list
      @jobs.splice(@jobs.indexOf(job), 1)
      job.destroy(false)

  append: (init_fn_or_job, run_fn, destroy_fn) ->
    @_appendJob(init_fn_or_job, run_fn, destroy_fn)
