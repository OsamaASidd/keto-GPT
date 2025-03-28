import NutritionScore from './NutritionScore';

const FoodItem = ({ food }) => {
    const { name, description, score, region } = food;
    
    return (
        <div className="food-item">
            <NutritionScore score={score} region={region} />
            <div className="food-item-details">
                <div className="food-item-title">{name}</div>
                <div className="food-item-description">{description}</div>
            </div>
        </div>
    );
};

export default FoodItem;