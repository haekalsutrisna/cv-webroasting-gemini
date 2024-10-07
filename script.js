document.getElementById('cvForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const fileInput = document.getElementById('cvFile');
    const file = fileInput.files[0];

    if (file && file.type === 'application/pdf') {
        // Upload the file using the File API
        try {
            const uploadResponse = await uploadFile(file);
            const fileUri = uploadResponse.uri; // Get the URI of the uploaded file

            // Generate content based on the uploaded file
            const contentResponse = await generateContent(fileUri);
            document.getElementById('response').innerText = `Roasted CV:\n${contentResponse.text}`;
        } catch (error) {
            document.getElementById('response').innerText = `Error roasting CV: ${error.message}`;
            console.error('Error roasting CV:', error);
        }
    } else {
        alert('Please upload a valid PDF file.');
    }
});

// Function to upload a file using the Gemini API
async function uploadFile(file) {
    const apiKey = 'AIzaSyBIaylp9FsxWNgRwjC5kY1MGje4ZhbzVSI'; // Replace with your Gemini API key

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/media/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Error uploading file: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Function to generate content based on the uploaded file
async function generateContent(fileUri) {
    const apiKey = 'AIzaSyBIaylp9FsxWNgRwjC5kY1MGje4ZhbzVSI'; // Replace with your Gemini API key
    const model = "gemini-1.5-flash"; // Adjust according to the specific model you are using

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompts: [`Give me a summary of this PDF file.`],
            inputs: [fileUri],
        }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Error generating content: ${errorResponse.error.message}`);
    }

    return await response.json();
}
