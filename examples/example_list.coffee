job_list = new Background.JobList(20) # timeslice of 20ms per iteration

# batch set up
tick_result=[]
iteration_count = 0

job_list.append(
  tick: -> tick_result.push('This'); return false
  finish: (was_completed) -> if was_completed then alert('Test completed') else alert('Test cancelled and job list destroyed')
)
job_list.append(tick: -> tick_result.push('is');     return false)
job_list.append(tick: -> tick_result.push('a');      return false)
job_list.append(tick: ->
  tick_result.push('test')
  job_list.append(tick: -> tick_result.push('contrived'); return false)
  job_list.append(tick: -> tick_result.push('test'); return false)
  job_list.append(tick: -> alert(tick_result.join(' ')); tick_result=[]; job_list.destroy(); return true)
  return true
)
job_list.append(-> alert(tick_result.join(' ')); tick_result=[]; return true)
