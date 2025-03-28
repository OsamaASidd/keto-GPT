"use client"

import { useState, useEffect } from 'react';
import NutritionScore from './NutritionScore';
const ingredientScores = {
  // Proteins
  "ground beef": "B",
  "beef": "B",
  "veal": "B",
  "trotters": "C",
  "goat": "B",
  "lamb": "C",
  "mutton": "C",
  "chicken": "B",
  "turkey": "B",
  "duck": "C",
  "fish": "A",
  "salmon": "A",
  "tuna": "A",
  "shrimp": "A",
  "crab": "A",
  "lobster": "A",
  "eggs": "B",
  "tofu": "B",
  "tempeh": "B",
  "seitan": "C",
  
  // Vegetables
  "onion": "A",
  "lemon": "B",
  "lemon guice": "B",
  "tomatoes": "A",
  "spinach": "A",
  "broccoli": "A",
  "tomato" : "B",
  "green chili" : "B",
  "cauliflower": "A",
  "bell peppers": "A",
  "zucchini": "A",
  "kale": "A",
  "carrots": "B",
  "beets": "B",
  "celery": "A",
  "cucumber": "A",
  "lettuce": "A",
  "mushrooms": "A",
  "green beans": "A",
  "peas": "B",
  "asparagus": "A",
  "sweet potatoes": "B",
  "potatoes": "C",
  "eggplant": "A",
  "pumpkin": "A",
  
  // Fruits
  "apples": "B",
  "oranges": "B",
  "bananas": "C",
  "berries": "A",
  "grapes": "C",
  "kiwi": "A",
  "mango": "C",
  "pineapple": "C",
  "avocado": "A",
  
  // Fats
  "olive oil": "A",
  "butter": "B",
  "ghee": "A",
  "vegetable oil": "B",
  "coconut oil": "B",
  "avocado oil": "A",
  "canola oil": "B",
  "sunflower oil": "B",
  
  // Dairy
  "cheese": "C",
  "cream": "C",
  "cream cheese": "C",
  "yogurt": "C",
  "milk": "C",
  "skim milk": "B",
  "cottage cheese": "B",
  
  // Nuts & Seeds
  "almonds": "B",
  "walnuts": "B",
  "flaxseeds": "A",
  "chia seeds": "A",
  "pumpkin seeds": "A",
  "sunflower seeds": "B",
  "peanuts": "B",
  
  // Grains
  "rice": "C",
  "brown rice": "B",
  "oats": "B",
  "quinoa": "A",
  "barley": "B",
  
  // Spices (generally good in moderation)
  "salt": "C",
  "pepper": "B",
  "cumin": "B",
  "coriander": "B",
  "bay leaf": "B",
  "turmeric": "A",
  "ginger": "A",
  "garlic": "A",
  "garam masala": "B",
  "red chili powder": "B",
  "cardamom": "B",
  "cinnamon": "B",
  "cloves": "B",
  "nutmeg": "B",
  "paprika": "B",
  "saffron": "A",
  "fennel seeds": "B",
  "mustard seeds": "B",
  "fenugreek": "B"
};

// Function to calculate the overall score for a recipe
function calculateOverallScore(ingredients) {
  // Filter only ingredients we have scores for
  const knownIngredients = ingredients.filter(ingredient => 
    Object.keys(ingredientScores).some(key => ingredient.includes(key))
  );
  
  if (knownIngredients.length === 0) return "Unknown";
  
  // Convert scores to numeric values
  const scoreValues = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
    "E": 1
  };
  
  // Calculate average score
  let totalScore = 0;
  let scoreCount = 0;
  
  knownIngredients.forEach(ingredient => {
    // Find matching ingredient in our database
    const matchingKey = Object.keys(ingredientScores).find(key => ingredient.includes(key));
    if (matchingKey) {
      const score = ingredientScores[matchingKey];
      totalScore += scoreValues[score];
      scoreCount++;
    }
  });
  
  if (scoreCount === 0) return "Unknown";
  
  const averageScore = totalScore / scoreCount;
  
  // Convert back to letter grade
  if (averageScore >= 4.5) return "A";
  if (averageScore >= 3.5) return "B";
  if (averageScore >= 2.5) return "C";
  if (averageScore >= 1.5) return "D";
  return "E";
}

// Function to get ingredient score, handling partial matches
function getIngredientScore(ingredient) {
  // Check for exact match
  if (ingredientScores[ingredient]) {
    return ingredientScores[ingredient];
  }
  
  // Check for partial match (ingredient contains a known food)
  const matchingKey = Object.keys(ingredientScores).find(key => ingredient.includes(key));
  if (matchingKey) {
    return ingredientScores[matchingKey];
  }
  
  return null;
}

// Function to fetch recipe from API
async function fetchRecipeFromAI(dishName) {
  try {
    console.log("Fetching recipe for:", dishName);
    const response = await fetch('/api/recipe-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dishName }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error(`API error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Recipe data received:", data);
    return data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
}

// Fallback recipe for when API fails
const getFallbackRecipe = (dishName) => {
  const normalizedName = dishName.charAt(0).toUpperCase() + dishName.slice(1).toLowerCase();
  
  if (dishName.toLowerCase().includes("beef") && dishName.toLowerCase().includes("paya")) {
    return {
      name: "Beef Paya",
      description: "A traditional South Asian dish made with beef trotters (feet), slow-cooked with aromatic spices to create a rich, flavorful stew.",
      ingredients: [
        "beef trotters",
        "onions",
        "garlic",
        "ginger",
        "tomatoes",
        "coriander",
        "turmeric",
        "red chili powder",
        "garam masala",
        "salt",
        "oil"
      ]
    };
  }
  
  return {
    name: normalizedName,
    description: `A dish known as ${normalizedName}. We've provided some estimated nutritional information based on common ingredients.`,
    ingredients: ["beef", "salt", "onions", "garlic", "oil"]
  };
};

// Main component
const RecipeAnalyzer = ({ dishName }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function getRecipe() {
      setLoading(true);
      setError(null);
      
      try {
        const recipeData = await fetchRecipeFromAI(dishName);
        if (recipeData && recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
          setRecipe(recipeData);
        } else {
          console.warn("Invalid recipe data format:", recipeData);
          // Use fallback recipe
          setRecipe(getFallbackRecipe(dishName));
        }
      } catch (err) {
        console.error('Error in recipe analysis:', err);
        setError('Could not retrieve recipe information from API. Using fallback data.');
        // Use fallback recipe
        setRecipe(getFallbackRecipe(dishName));
      } finally {
        setLoading(false);
      }
    }
    
    getRecipe();
  }, [dishName]);
  
  if (loading) {
    return <div className="loading">Analyzing recipe for {dishName}...</div>;
  }
  
  if (!recipe) {
    return (
      <div className="recipe-not-found">
        <h2>Recipe Not Found</h2>
        <p>We couldn't find nutritional information for "{dishName}". Try another dish or browse our general nutrition scores.</p>
      </div>
    );
  }
  
  const overallScore = calculateOverallScore(recipe.ingredients);
  
  return (
    <div className="recipe-analyzer">
      <h2>{recipe.name} Nutrition Analysis</h2>
      {error && <div className="recipe-warning">{error}</div>}
      <p className="recipe-description">{recipe.description}</p>
      
      <div className="overall-score-container">
        <h3>Overall Nutrition Score:</h3>
        <div className="overall-score">
          <NutritionScore score={overallScore} />
          <p className="score-explanation">
            This score represents the average nutritional quality of all ingredients, 
            not just how keto-friendly the dish is.
          </p>
        </div>
      </div>
      
      <h3>Ingredient Analysis:</h3>
      <div className="ingredients-list">
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-item">
            <span className="ingredient-name">{ingredient}</span>
            <span className="ingredient-score">
              {getIngredientScore(ingredient) ? (
                <NutritionScore score={getIngredientScore(ingredient)} />
              ) : (
                <span className="unknown-score">Not rated</span>
              )}
            </span>
          </div>
        ))}
      </div>
      
      <div className="keto-tips">
        <h3>Keto Considerations:</h3>
        <p>
          This dish is generally {overallScore === "A" || overallScore === "B" ? 
            "excellent" : overallScore === "C" ? "good" : "acceptable"} for a keto diet. 
          {recipe.ingredients.some(i => i.includes("salt")) && 
            " Watch the salt content to maintain proper electrolyte balance."}
          {recipe.ingredients.some(i => ["butter", "cream", "cheese"].some(d => i.includes(d))) && 
            " Be mindful of saturated fat intake from dairy sources."}
        </p>
      </div>
    </div>
  );
};

export default RecipeAnalyzer;