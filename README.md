[![Build Status](https://secure.travis-ci.org/kmalakoff/background.png)](http://travis-ci.org/kmalakoff/background)

````
 _                _                                   _    _
| |__   __ _  ___| | ____ _ _ __ ___  _   _ _ __   __| |  (_)___
| '_ \ / _` |/ __| |/ / _` | '__/ _ \| | | | '_ \ / _` |  | / __|
| |_) | (_| | (__|   < (_| | | | (_) | |_| | | | | (_| |_ | \__ \
|_.__/ \__,_|\___|_|\_\__, |_|  \___/ \__,_|_| |_|\__,_(_)/ |___/
                      |___/                             |__/
````

Background.js provides a background job queue and list with array iterators for Javascript applications.

#Download Latest (0.3.3):

Please see the [release notes](https://github.com/kmalakoff/background/blob/master/RELEASE_NOTES.md) for upgrade pointers.

* [Development version](https://raw.github.com/kmalakoff/background/0.3.3/background.js)
* [Production version](https://raw.github.com/kmalakoff/background/0.3.3/background.min.js)

###Module Loading

Background.js is compatible with RequireJS, CommonJS, Brunch and AMD module loading. Module names:

* 'background' - background.js.

# An Example:

````
  queue = new Background.JobQueue(10) # create a queue that processes each 10 milliseconds
  iterator = null # declare the iterator here so it is available in the init and run loop
  test_array1 = [3,7,11]; test_array2 = [3,5]; test_array3 = [13,3,23]
  iteration_count = 0; result = 0

  queue.push({
    # set up the iterator for the arrays in batches of 3
    start: (job) -> iterator = new Background.ArrayIterator_xN([test_array1,test_array2,test_array3],3)

    tick: (job) ->
      iteration_count++
      return iterator.nextByItems((items)-> result += items[0]*items[1]*items[2])

    # use the result here, push another job onto the queue, etc
    finish: (was_completed, job) ->
  })
````

# Classes:

## Background.JobQueue
A sequentially-processed background job queue. When you 'push' a job on a queue, it is run on each 'tick' until it signals it is finished then the job that was added immediately after is run on the next 'tick' until it has completed...and so on.

## Background.JobList
A sequentially-processed background job list. When you 'append' a job on a list, it and the rest of the jobs in the list are run on each 'tick' in the order they were appended until they signal that they are done.

## Background.ArrayIterator
A helper to iterate over a subset of an array on each 'tick'. You can either process the subset per iteration:

* callback per array item - by calling 'nextByItem' with a function of the form: (item) -> do_something
* callback per array slice - by calling 'nextBySlice' with a function of the form: (slice) -> do_something
* callback per range  (of type Background.Range)- by calling 'nextByRange' with a function of the form: (range) -> do_something
* manually using step() which returns a range (of type Background.Range) and isDone() after manually processing the range

## Background.Range
A single array range iterator which is used per iteration to access array items. Public interfaces:

* isDone(): returns boolean indicating whether the iteration is complete or you need to keep calling step()
* step(): keeps stepping through indices until done
* getItem(array): used to get the item that the range iterator is currently referring to
* getSlice(array): used to get all the items that the range is referring to

## Background.ArrayIterator_xN
A helper to iterate over a collection of arrays on each 'tick'. It is used to iterate through all combinations between the given arrays in equal steps on each tick; for example, you can apply M transformations to each of N elements giving N*M operations in arbitrary equal sized batches per tick. You can either process the subset per iteration:

* callback per array item - by calling 'nextByItems' with a function of the form: (items_array) -> do_something
* callback per array combinations - by calling 'nextByCombinations' with a function of the form: (combinations) -> do_something
* callback per range (of type Background.Range_xN) - by calling 'nextByRange' with a function of the form: (range) -> do_something
* manually using step() which returns a range (of type Background.Range_xN) and isDone() after manually processing the range

## Background.Range_xN
A multiple array range iterator which is used per iteration to access array items. Public interfaces:

* isDone(): returns boolean indicating whether the iteration is complete or you need to keep calling step()
* step(): keeps stepping through indices until done
* getItems(arrays): used to get the items that all of the range iterators are currently referring to
* getCombinations(arrays): used to get all the pair combinations of the arrays items that the range is referring to

## Background.Job
A job class which requires a functions.tick and can optionally be provided an functions.start and/or a functions.finish.

# Tips

  1) You can manually call 'tick' instead of waiting for the background timer.
  2) You can 'destroy' a job queue or list and it will cancel all of the jobs, and will mark it as destroyed.
  3) You can 'clear' a job queue or list and it will cancel all of the jobs.
  4) You can 'push' or 'append' a job without using the Background.Job class by just passing the functions directly. In other words,
    'my_list.append(null, ->)' is equivalent to 'my_list.append(new Background.Job(null, ->))'.

Please look at the provided examples and specs for sample code:

* https://github.com/kmalakoff/background/blob/master/examples/src/example_queue.coffee
* https://github.com/kmalakoff/background/blob/master/examples/src/example_list.coffee
* https://github.com/kmalakoff/background/blob/master/spec


# Background on Background.js
This library was originally based on the following project: https://github.com/infojunkie/JobQueue with the following enhancements:

### Allow the caller to provide set up and clean up functions:

* Job without setup and cleanup:

````
job_queue = new Background.JobQueue(10) # timeslice of 10ms per iteration
job_queue.push(-> return true) # done on first run
````

* Job with setup and cleanup:

````
some_var = false
job_queue = new Background.JobQueue(10) # timeslice of 10ms per iteration
job_queue.push({
  start: -> some_var=1
  finish: (was_completed)-> some_var=true
})
````

### The addition of an array iterator

* Iterate by array item per timeslice

````
some_data = [1, 2, 3, 4]
iterator = null
job_queue = new Background.JobQueue(10) # timeslice of 10ms per iteration
job_queue.push({
  # process 2 items per job timeslice
  start: -> iterator = new Background.ArrayIterator(some_data, 2)
  tick: -> return iterator.nextByItem((item) ->)
})
````

* Iterate by array slice per timeslice

````
some_data = [1, 2, 3, 4]
iterator = null
job_queue = new Background.JobQueue(10) # timeslice of 10ms per iteration
job_queue.push(
  # process 2 items per job timeslice
  start: -> iterator = new Background.ArrayIterator(some_data, 2)
  tick: -> return iterator.nextBySlice((items) ->)
)
````

### Allow the caller to destroy the queue (for example, if you have a single page app)
````
was_destroyed = false
job_queue = new Background.JobQueue(10) # timeslice of 10ms per iteration
job_queue.push({
  tick: -> return false # not done
  finish: (was_completed)-> was_destroyed=(was_completed==false)
})
job_queue.destroy(); job_queue = null
````

Release Notes
-----------------------

# 0.3.3

Reduced verbosity of task setup by:
1. allowing for run functions to be passed if start and finish callbacks are not required
2. using an object with {start: s, run: r, finish: f} functions so only the minimal functions need to be specified
3. allowing the run function to be ignored meaning only the start and finish are called (if they exist) and the task finishes on its first run


Building, Running and Testing the library
-----------------------

###Installing:

1. install node.js: http://nodejs.org
2. install node packages: 'npm install'

###Commands:

Look at: https://github.com/kmalakoff/easy-bake