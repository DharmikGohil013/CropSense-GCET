// This file contains the JavaScript code for the web application, handling client-side interactions.

document.addEventListener("DOMContentLoaded", function() {
    const predictButton = document.getElementById("predict-button");
    const resultDiv = document.getElementById("result");
    
    predictButton.addEventListener("click", async function() {
        const imageInput = document.getElementById("image-input");
        const formData = new FormData();
        formData.append("image", imageInput.files[0]);

        try {
            const response = await fetch("/predict", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            displayResult(result);
        } catch (error) {
            console.error("Error during prediction:", error);
            resultDiv.innerHTML = "Error during prediction. Please try again.";
        }
    });

    function displayResult(result) {
        resultDiv.innerHTML = `
            <h3>Prediction Results:</h3>
            <p><strong>Disease:</strong> ${result.disease} (${result.disease_confidence})</p>
            <p><strong>Variety:</strong> ${result.variety} (${result.variety_confidence})</p>
        `;
    }
});