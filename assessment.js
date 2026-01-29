// Assessment form handling
const form = document.getElementById('assessmentForm');
const resultsContainer = document.getElementById('resultsContainer');

// Map questions to dimensions
const questionDimensions = {
    q1: 'capability',
    q2: 'capability',
    q3: 'capability',
    q4: 'capability',
    q5: 'capability',
    q6: 'collaboration',
    q7: 'collaboration',
    q8: 'collaboration',
    q9: 'collaboration',
    q10: 'collaboration',
    q11: 'collaboration',
    q12: 'energy',
    q13: 'energy',
    q14: 'energy',
    q15: 'energy'
};

// Update progress
function updateProgress() {
    const radios = document.querySelectorAll('input[type="radio"]:checked');
    const answeredCount = radios.length;
    document.getElementById('answeredCount').textContent = answeredCount;
}

// Add event listeners to all radio buttons
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', updateProgress);
});

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Calculate scores
    const scores = calculateScores();
    
    // Display results
    displayResults(scores);
});

// Calculate dimension scores using German formula
function calculateScores() {
    const sums = {
        capability: 0,
        collaboration: 0,
        energy: 0
    };

    const counts = {
        capability: 0,
        collaboration: 0,
        energy: 0
    };

    // Get all checked radio buttons and sum values
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        const questionKey = radio.name;
        const dimension = questionDimensions[questionKey];
        const value = parseInt(radio.value);

        sums[dimension] += value;
        counts[dimension]++;
    });

    // Calculate averages and apply formula: (Average - 1) / 4 × 100
    const results = {
        averages: {},
        percentages: {},
        finalScore: 0,
        classification: ''
    };

    let product = 1;
    let dimensionScores = [];

    Object.keys(sums).forEach(dimension => {
        if (counts[dimension] > 0) {
            const average = sums[dimension] / counts[dimension];
            const percentage = ((average - 1) / 4) * 100;

            results.averages[dimension] = Math.round(average * 100) / 100;
            results.percentages[dimension] = Math.round(percentage * 10) / 10;

            product *= results.percentages[dimension];
            dimensionScores.push(results.percentages[dimension]);
        }
    });

    // Calculate cube root of product (final TeamPower Index)
    results.finalScore = Math.round(Math.cbrt(product) * 10) / 10;

    // Assign classification
    if (results.finalScore <= 49) {
        results.classification = 'Development Needed';
    } else if (results.finalScore <= 65) {
        results.classification = 'Basic Level';
    } else if (results.finalScore <= 77) {
        results.classification = 'Good Level';
    } else if (results.finalScore <= 90) {
        results.classification = 'Very Good';
    } else {
        results.classification = 'Outstanding';
    }

    return results;
}

// Display results
function displayResults(scores) {
    // Hide form, show results
    form.style.display = 'none';
    resultsContainer.classList.remove('hidden');

    // Display scores with animated progress bars
    const displayScore = (elementId, barId, score) => {
        document.getElementById(elementId).textContent = score;
        // Animate the progress bar
        setTimeout(() => {
            document.getElementById(barId).style.width = score + '%';
        }, 100);
    };

    displayScore('capabilityScore', 'capabilityBar', scores.capability);
    displayScore('collaborationScore', 'collaborationBar', scores.collaboration);
    displayScore('energyScore', 'energyBar', scores.energy);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
