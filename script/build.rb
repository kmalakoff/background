# Run me with: 'ruby script/build.rb'
require 'rubygems'
PROJECT_ROOT = File.expand_path('../..', __FILE__)

####################################################
# Background Library
####################################################
`cd #{PROJECT_ROOT}; coffee -b -o build -c #{PROJECT_ROOT}/src`
`cd #{PROJECT_ROOT}; jammit -c config/assets.yaml -o #{PROJECT_ROOT}`

####################################################
# Tests
####################################################
`cd #{PROJECT_ROOT}; coffee -b -o spec/build -c spec`

####################################################
# Examples
####################################################
`cd #{PROJECT_ROOT}; cp background.js examples`
`cd #{PROJECT_ROOT}; coffee -b -o examples/build -c examples`
