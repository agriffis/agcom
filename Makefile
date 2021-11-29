dev: lib/images.json
	yarn start

images lib/images.json: $(wildcard public/img/*)
	json=$$(bin/gen-images.js) && \
	  [[ -n $$json ]] && \
	  echo "$$json" > lib/images.json
