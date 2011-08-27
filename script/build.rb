# Run me with: 'ruby script/build.rb'
require 'rubygems'
PROJECT_ROOT = File.expand_path('../..', __FILE__)

####################################################
# Worker Queue Library
####################################################
`cd #{PROJECT_ROOT}; coffee -o build -c src`
`cd #{PROJECT_ROOT}; jammit -c config/assets.yaml -o build`

####################################################
# Examples
####################################################
`cd #{PROJECT_ROOT}; coffee -o examples -c src`
`cd #{PROJECT_ROOT}; coffee -o examples -c examples/src`
