document.addEventListener('DOMContentLoaded', function () {
    // Get all the topic headings and allow collapsible sections
    const topicHeadings = document.querySelectorAll('.array h2');
    topicHeadings.forEach(heading => {
        heading.addEventListener('click', function () {
            const questionsContainer = this.nextElementSibling;
            questionsContainer.classList.toggle('visible');
        });
    });

    // Track checkboxes and stats
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const solvedCountElem = document.getElementById('solved-count');
    const unsolvedCountElem = document.getElementById('unsolved-count');
    const totalCountElem = document.getElementById('total-count');

    const totalQuestions = checkboxes.length;
    let solvedQuestions = JSON.parse(localStorage.getItem('solvedQuestions')) || [];

    // Update count display
    function updateCounts() {
        solvedCountElem.textContent = solvedQuestions.length;
        unsolvedCountElem.textContent = totalQuestions - solvedQuestions.length;
        totalCountElem.textContent = totalQuestions;
    }

    // Initialize checkbox states from localStorage
    checkboxes.forEach(checkbox => {
        const questionKey = checkbox.id || checkbox.dataset.questionId || checkbox.dataset.questionName || checkbox.parentElement.textContent.trim();

        if (solvedQuestions.includes(questionKey)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', function () {
            const key = questionKey;

            if (this.checked) {
                if (!solvedQuestions.includes(key)) {
                    solvedQuestions.push(key);
                }
            } else {
                solvedQuestions = solvedQuestions.filter(q => q !== key);
            }

            // Update localStorage
            localStorage.setItem('solvedQuestions', JSON.stringify(solvedQuestions));

            // Update counts
            updateCounts();
        });
    });

    // Initialize counts on load
    updateCounts();
});
