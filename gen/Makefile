SOLUTIONS ?= solutions.txt

ipfs_file:
	@node upload.js $(FILE_PATH)

addresses:
	@echo "Generate solution addresses from $(SOLUTIONS) into addresses.txt"
	@node adresser.js $(SOLUTIONS) > addresses.txt
