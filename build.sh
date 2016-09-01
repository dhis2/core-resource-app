set -e

echo "Building React 14 with touch";
cd react-14
../node_modules/.bin/webpack --config webpack.config.min.js -p --progress
../node_modules/.bin/webpack --config webpack.config.js --progress
cd ..
echo "- Done";

echo "Building React 15 with touch";
cd react-15
../node_modules/.bin/webpack --config webpack.config.min.js -p --progress
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
