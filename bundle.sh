rm -rf .next/ build/;
rm impervious-extension.zip;

yarn next build;
yarn next export -o build;

cp public/manifest.json ./build;

mv ./build/_next ./build/next
cd ./build && grep -rli '_next' * | xargs -I@ sed -i '' 's/_next/next/g' @;

zip -r -FS ../impervious-extension.zip *;