// Pie Chart - Time Spent on DSA Topics
const pieCtx = document.getElementById('pieChart').getContext('2d');
new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Arrays', 'Graphs', 'Dynamic Programming', 'Recursion', 'Sorting & Searching'],
        datasets: [{
            data: [25, 20, 15, 10, 30], // Adjust values as needed
            backgroundColor: ['#007BFF', '#28A745', '#FD7E14', '#6F42C1', '#DC3545'],
        }]
    }
});

// Bar Chart - Problems Solved
const barCtx = document.getElementById('barChart').getContext('2d');
new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
            label: 'Problems Solved',
            data: [50, 30, 10], // Adjust values
            backgroundColor: ['#28A745', '#FD7E14', '#DC3545'],
        }]
    }
});

// script for faq

document.querySelectorAll(".faq-question").forEach(button => {
button.addEventListener("click", function () {
this.classList.toggle("active");
let answer = this.nextElementSibling;

if (answer.style.maxHeight) {
    answer.style.maxHeight = null; // Collapse
} else {
    document.querySelectorAll(".faq-answer").forEach(ans => ans.style.maxHeight = null);
    answer.style.maxHeight = answer.scrollHeight + "px"; // Expand
}
});
});