try
  # import Background
  Background = if not window.Background and (typeof(require) != 'undefined') then require('background') else window.Background

  describe("Background.JobQueue", ->
    describe("TEST DEPENDENCY MISSING", ->
      it("Background should be defined", ->
        expect(!!Background).toBeTruthy()
      )
    )

    ##############################
    # init_fn
    ##############################
    describe("init_fn is called when expected", ->
      it("should not call init_fn without a tick", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        init_fn = jasmine.createSpy("init_fn")
        expect(->job_queue.push(init_fn, (->return false))).not.toThrow()
        expect(init_fn).not.toHaveBeenCalled()
      )
      it("should call init_fn once for one tick", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        init_fn = jasmine.createSpy("init_fn")
        expect(->job_queue.push(init_fn, (->return false))).not.toThrow()
        job_queue.tick()
        expect(init_fn).toHaveBeenCalled()
      )
      it("should call init_fn once for multiple ticks", ->
        call_count = 0
        job_queue = new Background.JobQueue(10000)   # some long time
        init_fn = jasmine.createSpy("init_fn").andCallFake(->call_count++)
        expect(->job_queue.push(init_fn, (->return false))).not.toThrow()
        job_queue.tick(); job_queue.tick(); job_queue.tick()
        expect(init_fn).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
    )
    
    ##############################
    # run_fn
    ##############################
    describe("run_fn is called when expected", ->
      it("should not call run_fn without a tick", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        run_fn = jasmine.createSpy("run_fn").andCallFake(->return false)
        expect(->job_queue.push(null, run_fn)).not.toThrow()
        expect(run_fn).not.toHaveBeenCalled()
      )
      it("should call run_fn once for one tick", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        run_fn = jasmine.createSpy("run_fn").andCallFake(->return false)
        expect(->job_queue.push(null, run_fn)).not.toThrow()
        job_queue.tick()
        expect(run_fn).toHaveBeenCalled()
      )
      it("should call run_fn once per tick for multiple ticks when told to continue", ->
        call_count = 0
        job_queue = new Background.JobQueue(10000)   # some long time
        run_fn = jasmine.createSpy("run_fn").andCallFake(->call_count++; return false)
        expect(->job_queue.push(null, run_fn)).not.toThrow()
        job_queue.tick(); job_queue.tick(); job_queue.tick()
        expect(run_fn).toHaveBeenCalled()
        expect(call_count==3).toBeTruthy()
      )
      it("should call run_fn once for multiple ticks when told to finish", ->
        call_count = 0
        job_queue = new Background.JobQueue(10000)   # some long time
        run_fn = jasmine.createSpy("run_fn").andCallFake(->call_count++; return true)
        expect(->job_queue.push(null, run_fn)).not.toThrow()
        job_queue.tick(); job_queue.tick(); job_queue.tick()
        expect(run_fn).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
    )

    ##############################
    # destroy_fn
    ##############################
    describe("destroy_fn is called when expected", ->
      it("should not call destroy_fn without a tick", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn")
        expect(->job_queue.push(null, (->return false), destroy_fn)).not.toThrow()
        expect(destroy_fn).not.toHaveBeenCalled()
      )
      it("should not call destroy_fn with a tick and non-finished task", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn")
        expect(->job_queue.push(null, (->return false), destroy_fn)).not.toThrow()
        expect(destroy_fn).not.toHaveBeenCalled()
      )
      it("should call destroy_fn once for one tick for a finished task", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn")
        expect(->job_queue.push(null, (->return true), destroy_fn)).not.toThrow()
        job_queue.tick()
        expect(destroy_fn).toHaveBeenCalled()
      )
      it("should call destroy_fn once for multiple ticks when told to finish", ->
        call_count = 0
        job_queue = new Background.JobQueue(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake(->call_count++)
        expect(->job_queue.push(null, (->return true), destroy_fn)).not.toThrow()
        job_queue.tick(); job_queue.tick(); job_queue.tick()
        expect(destroy_fn).toHaveBeenCalled()
        expect(call_count==1).toBeTruthy()
      )
      it("should call destroy_fn once for multiple ticks when destroyed", ->
        call_count = 0
        job_queue = new Background.JobQueue(30)
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake(->call_count++)
        expect(->job_queue.push(null, (->return false), destroy_fn)).not.toThrow()
        job_queue.tick()
        job_queue.destroy(); job_queue = null
        waitsFor(-> return destroy_fn.wasCalled)
        runs(-> 
          expect(destroy_fn).toHaveBeenCalled()
          expect(call_count==1).toBeTruthy()
        )
      )
      it("should indicate the task was completed when completed", ->
        param_was_completed = false
        job_queue = new Background.JobQueue(10000)   # some long time
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake((was_completed)->param_was_completed=was_completed)
        expect(->job_queue.push(null, (->return true), destroy_fn)).not.toThrow()
        job_queue.tick()
        expect(destroy_fn).toHaveBeenCalled()
        expect(param_was_completed).toBeTruthy()
      )
      it("should indicate the task was not completed when destroyed", ->
        param_was_completed = true
        job_queue = new Background.JobQueue(30)
        destroy_fn = jasmine.createSpy("destroy_fn").andCallFake((was_completed)->param_was_completed=was_completed)
        expect(->job_queue.push(null, (->return true), destroy_fn)).not.toThrow()
        job_queue.tick(); job_queue.tick(); job_queue.tick()
        job_queue.destroy(); job_queue = null
        waitsFor(-> return destroy_fn.wasCalled)
        runs(-> 
          expect(destroy_fn).toHaveBeenCalled()
        )
      )
    )
    
    ##############################
    # push functions and tick
    ##############################
    describe("checking job run_fn is called for each tick", ->
      it("should call once for one tick", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        call_count=0
        job_queue.push(null, 
          (-> 
            call_count++
            return false # not done
          )
        )
        job_queue.tick()
        expect(call_count==1).toBeTruthy()
      )
      it("should call three times for three ticks", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        call_count=0
        job_queue.push(null, 
          (-> 
            call_count++
            return false # not done
          )
        )
        job_queue.tick(); job_queue.tick(); job_queue.tick()
        expect(call_count==3).toBeTruthy()
      )
    )

    ##############################
    # push Background.Job and tick
    ##############################
    describe("checking job run_fn is called for each tick", ->
      it("should call once for one tick", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        call_count=0
        job = new Background.Job(null, 
          (-> 
            call_count++
            return false # not done
          )
        )
        job_queue.push(job)
        job_queue.tick()
        expect(call_count==1).toBeTruthy()
      )
      it("should call three times for three ticks", ->
        job_queue = new Background.JobQueue(10000)   # some long time
        call_count=0
        job = new Background.Job(null, 
          (-> 
            call_count++
            return false # not done
          )
        )
        job_queue.push(job)
        job_queue.tick(); job_queue.tick(); job_queue.tick()
        expect(call_count==3).toBeTruthy()
      )
    )
  )

catch error
  alert("Background.JobQueue specs failed: '#{error}'")