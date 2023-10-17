import * as aws from 'aws-sdk';

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

export default {
  s3: new aws.S3(),
  mediaConvert: new aws.MediaConvert({
    apiVersion: process.env.AWS_MEDIACONVERT_API_VERSION,
    endpoint: process.env.AWS_MEDIACONVERT_API_ENDPOINT,
  }),
};
