import FoodItem from './FoodItem';

const FoodList = ({ foods }) => {
    if (!foods || foods.length === 0) {
        return <div>No food items available.</div>;
    }
    
    return (
        <div className="food-list">
            {foods.map((food, index) => (
                <FoodItem key={`food-${index}`} food={food} />
            ))}
        </div>
    );
};


export default FoodList;