rm -rf .next/ out/;
rm impervious-extension.zip;

yarn next build;
yarn next export;

cp public/manifest.json ./out;

mv ./out/_next ./out/next
cd ./out && grep -rli '_next' * | xargs -I@ sed -i '' 's/_next/next/g' @;

zip -r -FS ../impervious-extension.zip *;