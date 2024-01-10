import { BlobServiceClient } from "@azure/storage-blob";

export async function uploadFile(containerName, file) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    import.meta.env.VITE_AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(file.name);
  const blockBlobClient = blobClient.getBlockBlobClient();
  const result = await blockBlobClient.uploadData(file, {
    onProgress: ev => console.log(ev)
  });
  console.log(`Upload of file '${file.name}' completed`);
}
