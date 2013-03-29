try
  require.config({
    paths:
      'background': "../../background"
  })

  require ['background', 'jasmine_test_runner'], (Background, runner) ->
    window.Background = null # force each test to require dependencies synchronously

    require [
      './build/background_array_iterator_spec'
      './build/background_array_iterator_x2_spec'
      './build/background_array_iterator_x3_spec'
      './build/background_job_list_spec'
      './build/background_job_queue_spec'
      './build/background_job_spec'
    ], ->
      runner.start()

catch error
  alert("AMD tests failed: '#{error}'")