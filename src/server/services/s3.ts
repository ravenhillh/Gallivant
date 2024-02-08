import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
dotenv.config();

const bucketName=process.env.AWS_BUCKET_NAME ?? 'default';
const region=process.env.AWS_BUCKET_REGION;
const accessKeyId=process.env.AWS_ACCESS_KEY;
const secretAccessKey=process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

export const uploadPhoto = (imageName: string, base64Image:string) => {
  const uploadParams = {
    Bucket: bucketName,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Body: new (Buffer as any).from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
    Key: imageName
  };

  return s3.upload(uploadParams).promise();
};

export const getFileStream = (key:string) => {
  const downloadParams = {
    Key: key,
    Bucket: bucketName
  };
  return s3.getObject(downloadParams).createReadStream();
};

// export default uploadPhoto;
