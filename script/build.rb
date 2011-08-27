# Run me with: 'ruby script/build.rb'
require 'rubygems'
PROJECT_ROOT = File.expand_path('../..', __FILE__)

####################################################
# Job Queue Library
####################################################
`cd #{PROJECT_ROOT}; coffee -b -o build/parts -c src`
`cd #{PROJECT_ROOT}; jammit -c config/assets.yaml -o build`
`cd #{PROJECT_ROOT}; jammit -c config/assets_min.yaml -o build`

####################################################
# Tests
####################################################
`cd #{PROJECT_ROOT}; coffee -b -o spec/javascripts -c spec/javascripts/src`

####################################################
# Examples
####################################################
`cd #{PROJECT_ROOT}; cp build/background.js examples`
`cd #{PROJECT_ROOT}; coffee -b -o examples -c examples/src`
