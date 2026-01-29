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

    // Display dimension scores and calculation steps
    const displayDimensionScore = (elementId, barId, dimensionName, average, percentage) => {
        document.getElementById(elementId).textContent = percentage;
        // Animate the progress bar
        setTimeout(() => {
            document.getElementById(barId).style.width = percentage + '%';
        }, 100);

        // Update calculation steps - Step 1: Show averages
        const stepElement = document.getElementById(`${dimensionName}-calculation`);
        if (stepElement) {
            const displayName = dimensionName === 'capability' ? 'Capability' :
                              dimensionName === 'collaboration' ? 'Collaboration' : 'Energy';
            stepElement.innerHTML = `<strong>${displayName}:</strong> ${average} (Average of questions) → (${average} - 1) / 4 × 100 = ${percentage}%`;
        }
    };

    displayDimensionScore('capabilityScore', 'capabilityBar', 'capability', scores.averages.capability, scores.percentages.capability);
    displayDimensionScore('collaborationScore', 'collaborationBar', 'collaboration', scores.averages.collaboration, scores.percentages.collaboration);
    displayDimensionScore('energyScore', 'energyBar', 'energy', scores.averages.energy, scores.percentages.energy);

    // Display final TeamPower Index and classification
    document.getElementById('finalScore').textContent = scores.finalScore;
    document.getElementById('classification').textContent = scores.classification;

    // Update Step 3 with actual cube root calculation
    const product = scores.percentages.capability * scores.percentages.collaboration * scores.percentages.energy;
    const step3Info = document.querySelector('.steps-content');
    if (step3Info) {
        const step3Elements = step3Info.querySelectorAll('.step-intro');
        if (step3Elements.length > 2) {
            const step3Text = step3Elements[2];
            // Update the note after Step 3
            const step3Notes = step3Info.querySelectorAll('.step-note');
            if (step3Notes.length > 1) {
                step3Notes[1].innerHTML = `∛(${scores.percentages.capability} × ${scores.percentages.collaboration} × ${scores.percentages.energy}) = ${scores.finalScore}`;
            }
        }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Download results as PDF
function downloadResults() {
    const heading = document.querySelector('.results-heading').textContent;
    const finalScore = document.getElementById('finalScore').textContent;
    const classification = document.getElementById('classification').textContent;
    const capabilityScore = document.getElementById('capabilityScore').textContent;
    const collaborationScore = document.getElementById('collaborationScore').textContent;
    const energyScore = document.getElementById('energyScore').textContent;

    let content = `${heading}\n\n`;
    content += `TeamPower Index: ${finalScore} - ${classification}\n\n`;
    content += `Dimension Scores:\n`;
    content += `Capability: ${capabilityScore}%\n`;
    content += `Collaboration: ${collaborationScore}%\n`;
    content += `Energy: ${energyScore}%\n\n`;
    content += `Copyright © BITOU 2026\nVisit: https://www.bitou.de/en/`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'TeamPower-Results.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
