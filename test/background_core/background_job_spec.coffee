try
  # import Background
  Background = if not window.Background and (typeof(require) != 'undefined') then require('background') else window.Background

  describe("Background.Job", ->
    describe("TEST DEPENDENCY MISSING", ->
      it("Background should be defined", ->
        expect(!!Background).toBeTruthy()
      )
    )

    ##############################
    # new Background.Job()
    ##############################
    describe("new Background.Job()", ->
      it("should not require an init_fn", ->
        expect(->new Background.Job(null, ->)).not.toThrow()
      )
      it("should require a run_fn", ->
        expect(->new Background.Job(null, null)).toThrow('run_fn is mandatory')
      )
      it("should not require a destroy_fn", ->
        expect(->new Background.Job(null, (->), null)).not.toThrow()
      )
    )
  )

catch error
  alert("Background.Job specs failed: '#{error}'")