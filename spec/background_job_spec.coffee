try

  describe("Background.Job", ->
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