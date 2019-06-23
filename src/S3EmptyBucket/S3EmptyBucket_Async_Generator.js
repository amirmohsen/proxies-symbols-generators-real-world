const AWS = require('aws-sdk');

const s3 = new AWS.S3();

async function* listObjectVersions(bucket) {
  let nextKey;
  let nextVersion;
  let firstRun = true;

  while (nextVersion || firstRun) {
    const data = await s3.listObjectVersions({
      Bucket: bucket,
      KeyMarker: nextKey,
      VersionIdMarker: nextVersion,
      MaxKeys: 2 // Only for testing purposes
    }).promise();

    ({
      NextKeyMarker: nextKey,
      NextVersionIdMarker: nextVersion
    } = data);

    yield data.Versions.map(({ Key, VersionId }) => ({ Key, VersionId }));

    firstRun = false;
  }
}

const deleteObjects = (bucket) => async(objects) => {
  const data = await s3.deleteObjects({
    Bucket: bucket,
    Delete: {
      Objects: objects,
      Quiet: false
    }
  }).promise();

  return data.Deleted.length;
};

const countDeletions = async (promises) => {
  const counts = await Promise.all(promises);
  return counts.reduce((total, count) => (total + count), 0);
};

const emptyBucket = async(bucket) => {
  const del = deleteObjects(bucket);
  const promises = [];

  for await (const objects of listObjectVersions(bucket)) {
    if (objects.length === 0) {
      break;
    }
    console.log(objects);
    promises.push(del(objects));
  }

  const totalDeletionCount = await countDeletions(promises);

  console.log('Total deleted object count', totalDeletionCount);
};

emptyBucket(process.argv[2]);
