set -e

echo "Building React 14";
cd react-14
../node_modules/.bin/webpack --config webpack.config.js -p --progress
echo "-Done";

echo "Building React 15";
cd ..
cd react-15
../node_modules/.bin/webpack --config webpack.config.js -p --progress
echo "-Done";