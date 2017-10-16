set -e

printf "\e[32mBuilding React 14 with touch...\n\e[0m"
pushd react-14
yarn install
# Minified
../node_modules/.bin/webpack --config webpack.config.js -p --progress
# Regular
../node_modules/.bin/webpack --config webpack.config.js --progress
popd
printf "\e[33m- Done\n\e[0m"

printf "\e[32mBuilding React 15.3 with touch...\n\e[0m"
pushd react-15.3
yarn install
# Minified
../node_modules/.bin/webpack --config webpack.config.js -p --progress
# Regular
../node_modules/.bin/webpack --config webpack.config.js --progress
popd
printf "\e[33m- Done\n\e[0m"

printf "\e[32mBuilding React 15.4 with touch...\n\e[0m"
pushd react-15.4
yarn install
# Minified
../node_modules/.bin/webpack --config webpack.config.js -p --progress
# Regular
../node_modules/.bin/webpack --config webpack.config.js --progress
popd
printf "\e[33m- Done\n\e[0m"

printf "\e[32mBuilding Lodash functional that does not overwrite global...\n\e[0m"
pushd lodash-fp
yarn install
../node_modules/.bin/webpack --config webpack.config.js -p --progress
popd
printf "\e[33m- Done\n\e[0m"

printf "\e[32mInstalling JavaScript libraries from libraries.json...\n\e[0m"
node ./install-libraries-from-cdn.js
printf "\e[33m- Done\n\e[0m"

printf "\e[32mCopying fonts...\n\e[0m"
cp -r fonts ./build/
printf "\e[33m- Done\n\e[0m"

printf "\e[32mCopying material-design-icons...\n\e[0m"
cp -r material-design-icons ./build/
printf "\e[33m- Done\n\e[0m"

printf "\e[32mRev-ing files from the 'other' directory...\n\e[0m"
./node_modules/.bin/gulp
printf "\e[33m- Done\n\e[0m"

# TODO: Remove when all apps use proper versioned react.
printf "\e[32mCopying to legacy folders...\n\e[0m"
# React 14
mkdir -p build/react-14/
cp -v build/react/0.14.8/react-with-touch-tap-plugin.js build/react-14/react-14.js
cp -v build/react/0.14.8/react-with-touch-tap-plugin.js.map build/react-14/react-14.js.map
cp -v build/react/0.14.8/react-with-touch-tap-plugin.min.js build/react-14/react-14.min.js
cp -v build/react/0.14.8/react-with-touch-tap-plugin.min.js.map build/react-14/react-14.min.js.map

# React 15.3
mkdir -p build/react-15/
cp -v build/react/15.3.2/react-with-touch-tap-plugin.js build/react-15/react-15.js
cp -v build/react/15.3.2/react-with-touch-tap-plugin.js.map build/react-15/react-15.js.map
cp -v build/react/15.3.2/react-with-touch-tap-plugin.min.js build/react-15/react-15.min.js
cp -v build/react/15.3.2/react-with-touch-tap-plugin.min.js.map build/react-15/react-15.min.js.map

# Lodash functional
cp -v build/lodash-functional/1.0.1/lodash-functional.js build/lodash-functional/lodash-functional.js
cp -v build/lodash-functional/1.0.1/lodash-functional.js.map build/lodash-functional/lodash-functional.js.map
printf "\e[33m- Done\n\e[0m"