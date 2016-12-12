set -e

echo "Building React 14 with touch";
cd react-14
# Minified
../node_modules/.bin/webpack --config webpack.config.js -p --progress
# Regular
../node_modules/.bin/webpack --config webpack.config.js --progress
cd ..
echo "- Done";

echo "Building React 15 with touch";
cd react-15
# Minified
../node_modules/.bin/webpack --config webpack.config.js -p --progress
# Regular
../node_modules/.bin/webpack --config webpack.config.js --progress
cd ..
echo "- Done";

echo "Building Lodash functional that does not overwrite global";
cd lodash-fp
../node_modules/.bin/webpack --config webpack.config.js -p --progress
cd ..
echo "- Done";

echo "Installing JavaScript libraries from libraries.json";
node ./install-libraries-from-cdn.js
echo "- Done";

echo "Copying fonts";
cp -r fonts ./build/
echo "- Done";

echo "Copying material-design-icons";
cp -r material-design-icons ./build/
echo "- Done";

echo "Rev-ing files from the 'other' directory";
./node_modules/.bin/gulp
echo "- Done";

# TODO: Remove when all apps use proper versioned react.
echo "Copying to legacy folders"
# React 14
mkdir -p build/react-14/
cp -v build/react/0.14.8/react-with-touch-tap-plugin.js build/react-14/react-14.js
cp -v build/react/0.14.8/react-with-touch-tap-plugin.js.map build/react-14/react-14.js.map
cp -v build/react/0.14.8/react-with-touch-tap-plugin.min.js build/react-14/react-14.min.js
cp -v build/react/0.14.8/react-with-touch-tap-plugin.min.js.map build/react-14/react-14.min.js.map

# React 15
mkdir -p build/react-15/
cp -v build/react/15.3.2/react-with-touch-tap-plugin.js build/react-15/react-15.js
cp -v build/react/15.3.2/react-with-touch-tap-plugin.js.map build/react-15/react-15.js.map
cp -v build/react/15.3.2/react-with-touch-tap-plugin.min.js build/react-15/react-15.min.js
cp -v build/react/15.3.2/react-with-touch-tap-plugin.min.js.map build/react-15/react-15.min.js.map

# Lodash functional
cp -v build/lodash-functional/1.0.1/lodash-functional.js build/lodash-functional/lodash-functional.js
cp -v build/lodash-functional/1.0.1/lodash-functional.js.map build/lodash-functional/lodash-functional.js.map
echo "- Done";