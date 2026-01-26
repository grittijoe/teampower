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

// Calculate dimension scores
function calculateScores() {
    const scores = {
        capability: 0,
        collaboration: 0,
        energy: 0
    };
    
    const counts = {
        capability: 0,
        collaboration: 0,
        energy: 0
    };
    
    // Get all checked radio buttons
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        const questionKey = radio.name;
        const dimension = questionDimensions[questionKey];
        const value = parseInt(radio.value);
        
        scores[dimension] += value;
        counts[dimension]++;
    });
    
    // Calculate averages (scale to 0-100)
    const results = {};
    Object.keys(scores).forEach(dimension => {
        if (counts[dimension] > 0) {
            results[dimension] = Math.round((scores[dimension] / (counts[dimension] * 5)) * 100);
        } else {
            results[dimension] = 0;
        }
    });
    
    return results;
}

// Display results
function displayResults(scores) {
    // Hide form, show results
    form.style.display = 'none';
    resultsContainer.classList.remove('hidden');

    // Display scores
    document.getElementById('capabilityScore').textContent = scores.capability;
    document.getElementById('collaborationScore').textContent = scores.collaboration;
    document.getElementById('energyScore').textContent = scores.energy;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
