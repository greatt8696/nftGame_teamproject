const fs = require("fs");
const path = require("path");
const { ABILITY, BACKGROUND, FACE } = require("../jsonAsset/data.js");
const abilityLabels = Object.keys(ABILITY);
const imageDir = path.resolve("backend", "jsonAsset", "image");

/**
{
  "name": "#0",
  "description": "죠르디는 귀엽다?",
  "external_url": "http://localhost/metadata/0",
  "image": "http://localhost/images/0",
  "attributes": [
    { "trait_type": "gender", "value": "male" },
    { "trait_type": "level", "value": "Legendary" },
    { "display_type": "number", "trait_type": "attack", "value": 0 },         50  ~ 500
    { "display_type": "number", "trait_type": "defence", "value": 0 },        30  ~ 300
    { "display_type": "number", "trait_type": "magic_attack", "value": 0 },   50  ~ 500
    { "display_type": "number", "trait_type": "magic_defence", "value": 0 },  30  ~ 300
    { "display_type": "number", "trait_type": "speed", "value": 0 },          1   ~ 22
    { "display_type": "number", "trait_type": "hp", "value": 0 },             100 ~ 800 
    { "trait_type": "base_color", "value": "white" }
  ]
}
 */

const makeName = (name) => ({ name: `#${name}` });
const makeDescription = (description) => ({ description: `${description}` });
const makeExternalUrl = (
  id,
  baseUrl = "http://localhost:3000/api/metadata/"
) => ({
  external_url: baseUrl.concat(id),
});
const makeImageUrl = (id, baseUrl = "http://localhost:3000/api/images/") => ({
  image: baseUrl.concat(id),
});

const getImagesList = () => fs.readdirSync(imageDir);
// fs.readdirSync(path.resolve("images")).map((list) => {
//   return `http://localhost:3000/images/${list}`;
// });

const randomChoice = (inputArr) => {
  const arrSize = inputArr.length;
  const randIdx = Math.random() * arrSize;
  const toInt = parseInt(randIdx);
  return inputArr[toInt];
};

const partsOfAttributes = ({ trait_type, value, isNumber = false }) => {
  const parts = {};
  parts["trait_type"] = trait_type;
  parts["value"] = value;
  if (isNumber) parts["display_type"] = "number";
  return parts;
};

const makeAttributes = (attributes) => {
  return { attributes: attributes };
};

const makeBaseColor = (base_color) => {
  return { trait_type: "base_color", value: base_color };
};

const makeFace = (face) => {
  return { trait_type: "face", value: face };
};

const makeDeviation = (min, max, skew = 1, notFloat = true) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-9.0 * Math.log(u)) * Math.cos(9.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = makeDeviation(min, max, skew);
  // resample between 0 and 1 if out of range
  else {
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return notFloat ? parseInt(num) : num;
};

const BACTCHSIZE = 5000;

const abilities = Array(BACTCHSIZE)
  .fill(false)
  .map(() => {
    return abilityLabels.map((label) => {
      const [min, max, skew] = ABILITY[label];
      const randValue = makeDeviation(min, max, skew);
      const input = {
        trait_type: label,
        value: randValue,
        isNumber: true,
      };
      return partsOfAttributes(input);
    });
  });

const addedAbilities = abilities.map((ability) => [
  ...ability,
  makeBaseColor(randomChoice(BACKGROUND)),
  makeFace(randomChoice(FACE)),
]);

const metadata = Array(BACTCHSIZE)
  .fill(false)
  .map((_, idx) => {
    const test = {
      ...makeName(idx),
      ...makeDescription(`#${idx}의 테스트 내용입니댜-`),
      ...makeExternalUrl(idx),
      ...makeImageUrl(randomChoice(getImagesList())),
      ...makeAttributes(addedAbilities[idx]),
    };
    return test;
  });

metadata.forEach((metadata, idx) => {
  const metadataToJson = JSON.stringify(metadata);
  fs.writeFileSync(
    path.resolve("backend", "metadata", `${idx}.json`),
    metadataToJson
  );
  if (idx % 10 === 0)
    console.log(
      `JSON : ${idx}개/${BACTCHSIZE}개`,
      parseInt((idx / BACTCHSIZE) * 100),
      "%"
    );
});
