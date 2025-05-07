document.addEventListener("DOMContentLoaded", () => {
    const solvedCountElement = document.getElementById("solved-count");
    const unsolvedCountElement = document.getElementById("unsolved-count");
    const totalCountElement = document.getElementById("total-count");

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalCount = checkboxes.length;

    let solvedQuestions = JSON.parse(localStorage.getItem("solvedQuestions")) || [];

    checkboxes.forEach(checkbox => {
        const key = checkbox.id || checkbox.dataset.questionId || checkbox.dataset.questionName || checkbox.parentElement.textContent.trim();
        if (solvedQuestions.includes(key)) {
            checkbox.checked = true;
        }
    });

    // Update counts
    if (solvedCountElement) solvedCountElement.textContent = solvedQuestions.length;
    if (unsolvedCountElement) unsolvedCountElement.textContent = totalCount - solvedQuestions.length;
    if (totalCountElement) totalCountElement.textContent = totalCount;

    // ✅ Send solved questions to API
    if (solvedQuestions.length > 0) {
        console.log("Sending solved questions to API:", solvedQuestions);

        fetch("https://your-chatbot-api-endpoint.com/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer AIzaSyDwgsu7ATOyXVQRZCOYSbi_pZRNfqAQOf4"
            },
            body: JSON.stringify({ solvedQuestions })
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("✅ API response:", data);
        })
        .catch(error => {
            console.error("❌ API error:", error);
        });
    }
});
