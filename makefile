files = wellcome

#---------------------------------------------------------------------
# settings
#---------------------------------------------------------------------
MD := mkdir
ROOT := ./src

wellcome:
	@echo "This is Kao style project Reactjs structure"
	mkdir ${ROOT}/actions
	touch ${ROOT}/actions/index.js
	mkdir ${ROOT}/containers
	mkdir ${ROOT}/helpers
	mkdir ${ROOT}/reducers
	mkdir ${ROOT}/store
	mkdir ${ROOT}/styles
	touch ${ROOT}/index.html 
	touch ${ROOT}/index.js
	
