
document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const statusDiv = document.getElementById("status");
    statusDiv.textContent = "Preparing to upload...";

    try {
        // Fetch a pre-signed URL (or SAS token) for the upload
        const sasResponse = await fetch(
            "https://ops310prj2modutayo.blob.core.windows.net/incoming-files?sp=r&st=2024-12-08T04:17:50Z&se=2025-12-08T12:17:50Z&sv=2022-11-02&sr=c&sig=g05ebemGs6q0Ysq0%2Fb%2B9z9eL1t8E49%2FcJWqwZp%2FRYhc%3D", // Replace with your actual API endpoint or SAS URL provider
            {
                method: "GET",
            }
        );

        if (!sasResponse.ok) {
            throw new Error(`Failed to get upload URL. Status: ${sasResponse.status}`);
        }

        // Extract SAS URL from the response
        const { uploadUrl } = await sasResponse.json(); // Response should include a key like { "uploadUrl": "..." }

        // Perform the file upload using PUT to the SAS URL
        statusDiv.textContent = "Uploading file...";

        const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "x-ms-blob-type": "BlockBlob",
            },
            body: file,
        });

        if (uploadResponse.ok) {
            statusDiv.textContent = "File uploaded successfully!";
        } else {
            throw new Error(`Failed to upload file. Status: ${uploadResponse.status}`);
        }
    } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
    }
});
