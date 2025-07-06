
import axios from 'axios';

export default async function UploadService(fileContent) {
    const fileName = 'text.txt';
    const bucketName = 'tempbucketbtaasgcp'
    const url = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${fileName}`;
console.log("FILE", fileContent)
    try {
      const response = await axios.post(url, fileContent, {
        headers: {
          'Content-Type': 'text/plain', // Change this to the appropriate content type of your file
        },
      });
      console.log('File uploaded successfully', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

}
