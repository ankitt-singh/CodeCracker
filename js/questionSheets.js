document.addEventListener('DOMContentLoaded', function() {
    // Get all the topic headings
    const topicHeadings = document.querySelectorAll('.array h2');
    
    // Add click event listeners to each heading
    topicHeadings.forEach(heading => {
        heading.addEventListener('click', function() {
            // Find the questions container that's a sibling of the heading's parent
            const questionsContainer = this.nextElementSibling;
            
            // Toggle the 'visible' class to show/hide the questions
            questionsContainer.classList.toggle('visible');
            
            // Optional: Rotate a caret icon if you add one
            // const icon = this.querySelector('i');
            // if (icon) {
            //     icon.classList.toggle('rotate-180');
            // }
        });
    });
    
    // Optional: Track checkbox changes to update solved/unsolved counts
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const solvedCount = document.getElementById('solved-count');
    const unsolvedCount = document.getElementById('unsolved-count');
    const totalCount = document.getElementById('total-count');
    
    // Initialize counts
    let totalQuestions = checkboxes.length;
    let solvedQuestions = 0;
    
    // Set total count
    totalCount.textContent = totalQuestions;
    unsolvedCount.textContent = totalQuestions;
    
    // Add change event listeners to checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                solvedQuestions++;
            } else {
                solvedQuestions--;
            }
            
            // Update the counts
            solvedCount.textContent = solvedQuestions;
            unsolvedCount.textContent = totalQuestions - solvedQuestions;
        });
    });
});