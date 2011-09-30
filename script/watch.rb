# Run me with: 'ruby script/watch.rb'
require 'rubygems'
require 'directory_watcher'
require 'eventmachine'
require 'fileutils'

PROJECT_ROOT = File.expand_path('../..', __FILE__)
SRC_DIRS = ['src/**/*.coffee', 'examples/src/**/*.coffee', 'spec/javascripts/src/**/*.coffee']

dw = DirectoryWatcher.new(PROJECT_ROOT, :glob => SRC_DIRS, :scanner => :em, :pre_load => true)
dw.add_observer {|*args| args.each do |event|
  puts "#{File.basename(event.path)} changed. Rebuilding"
  `cd #{PROJECT_ROOT}; ruby script/build.rb`
  puts "Rebuilding finished. Now watching..."
end}

# build now
puts "Build started"
`cd #{PROJECT_ROOT}; ruby script/build.rb`
puts "Build finished. Now watching..."

# start watching
EM.kqueue
dw.start
   gets      # when the user hits "enter" the script will terminate
dw.stop