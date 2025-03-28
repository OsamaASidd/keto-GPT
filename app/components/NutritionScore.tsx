const NutritionScore = ({ score, region = 'germany' }) => {
    // Convert score to uppercase for consistency
    const normalizedScore = score.toUpperCase();
    
    // Define colors based on score
    const getScoreColor = (score) => {
        switch(score) {
            case 'A': return '#4CAF50'; // Green
            case 'B': return '#8BC34A'; // Light Green
            case 'C': return '#FFEB3B'; // Yellow
            case 'D': return '#FF9800'; // Orange
            case 'E': return '#F44336'; // Red
            default: return '#9E9E9E'; // Grey for unknown scores
        }
    };

    // Get label text based on region
    const getScoreLabel = (score, region) => {
        if (region.toLowerCase() === 'germany') {
            switch(score) {
                case 'A': return 'Excellent nutritional quality';
                case 'B': return 'Good nutritional quality';
                case 'C': return 'Medium nutritional quality';
                case 'D': return 'Low nutritional quality';
                case 'E': return 'Poor nutritional quality';
                default: return 'Unknown nutritional quality';
            }
        }
        // Can add more regions/countries here
        return 'Nutritional quality score';
    };

    return (
        <div className="nutrition-score">
            <div className="score-badge" style={{ backgroundColor: getScoreColor(normalizedScore) }}>
                {normalizedScore}
            </div>
            <div className="score-label">
                {getScoreLabel(normalizedScore, region)}
            </div>
        </div>
    );
};

export default NutritionScore;