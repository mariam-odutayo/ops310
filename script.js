document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = document.getElementById("fileInput").files[0];
    if (!file) return alert("Please select a file to upload.");

    const statusDiv = document.getElementById("status");
    statusDiv.textContent = "Uploading...";

    const storageUrl = "https://ops310prj2modutayo.blob.core.windows.net/incoming-files";
    const sasToken = "sp=r&st=2024-12-08T04:24:21Z&se=2025-12-08T12:24:21Z&sv=2022-11-02&sr=c&sig=lpObn3FR7m1AfzOd2gW9uobwt9XAF03x%2FpSc7mfnfYA%3D"; // Add your SAS token here
    const uploadUrl = `${storageUrl}/${file.name}?${sasToken}`;

    try {
        const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "x-ms-blob-type": "BlockBlob" },
            body: file,
        });

        statusDiv.textContent = response.ok
            ? "File uploaded successfully!"
            : `Failed to upload. Status: ${response.status}`;
    } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
    }
});

