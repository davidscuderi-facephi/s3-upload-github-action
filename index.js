const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const spacesEndpoint = new aws.Endpoint(process.env.S3_ENDPOINT);
const s3 = new aws.S3({
  signatureVersion: "v4",
  endpoint: spacesEndpoint,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

async function uploadSingleFile(filePath) {
  const fileContent = await fs.promises.readFile(filePath);
  // Setting up S3 upload parameters
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${process.env.S3_PREFIX || ""}/${path.normalize(filePath)}`,
    Body: fileContent,
  };
  const acl = process.env.S3_ACL;
  if (acl) {
    params.ACL = acl;
  }

  // Uploading files to the bucket
  return await s3.upload(params, function (err, data) {
    console.log('uploaded file.')
    if (err) {
      throw err;
    }
    return data
  }).promise()
}

async function startAction(inputValue) {
  const lstatRes = await fs.promises.lstat(inputValue)
  if (lstatRes.isDirectory()) {
    const filesInDirectory = await fs.promises.readdir(inputValue)
    const promises = filesInDirectory.map(async (file) => {
      return await startAction(`${inputValue}/${file}`)
    })
    await Promise.all(promises).then((res) => {
      res.forEach((unit) => { if(unit && unit.key) console.log(`uploaded to ${unit.key}`) })
    });
  } else {
    return await uploadSingleFile(inputValue);
  }
}

console.log('Starting upload action to S3. - Version 1.')
startAction(process.env.FILE).then(() => {
  console.log('Action is done.')
  process.exit()
}).catch(err => {
  console.log(err);
});
