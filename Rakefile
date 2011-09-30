require 'rubygems'

desc "build background.js and background.min.js"
task :build do
  begin
    load 'script/build.rb'
  rescue LoadError
    puts "build failed: ensure you have coffee-script ('npm install coffee-script -g') and jammit ('(sudo) gem install jammit') installed"
    exit
  end
end

desc "watch for file changes, and rebuild all src and spec files when they do"
task :watch do
  begin
    exec 'ruby script/watch.rb'
  rescue LoadError
    puts "build failed: ensure you have coffee-script ('npm install coffee-script -g') and jammit ('(sudo) gem install jammit') installed"
    exit
  end
end

desc "clean all the temporary files in background.js"
task :clean do
  begin
    exec 'ruby script/clean.rb'
  end
end

desc "start the jasmine server"
task :jasmine do
  begin
    require 'jasmine'
    load 'jasmine/tasks/jasmine.rake'
  rescue LoadError
    puts "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
    exit
  end
end
