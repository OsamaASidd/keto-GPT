"use client"

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import logo from "../assets/logo.png";
import Link from "next/link";
import FoodList from "../components/FoodList";
import NutritionScore from "../components/NutritionScore";
import ketoFoodData from "../components/ketoFoodsData";
import RecipeAnalyzer from "../components/RecipeAnalyzer";

export default function NutritionPage() {
    const [filterScore, setFilterScore] = useState('');
    const searchParams = useSearchParams();
    const dishParam = searchParams.get('dish');
    
    const handleFilterChange = (score) => {
        setFilterScore(score === filterScore ? '' : score);
    };

    const filteredFoods = filterScore 
        ? ketoFoodData.filter(food => food.score.toUpperCase() === filterScore.toUpperCase())
        : ketoFoodData;

    return (
        <main>
            <div className="page-header">
                <Image src={logo} width="150" alt="Keto Logo" />
                <Link href="/" className="back-link">← Back to Home</Link>
            </div>
            
            {dishParam ? (
                <RecipeAnalyzer dishName={dishParam} />
            ) : (
                <>
                    <h2 className="page-title">Keto Diet Nutrition Scores</h2>
                    <p className="page-description">Food items rated according to German nutrition standards (A-E).</p>
                    
                    <div className="score-filters">
                        <h3>Filter by score:</h3>
                        <div className="filter-buttons">
                            {['A', 'B', 'C', 'D', 'E'].map(score => (
                                <button 
                                    key={score}
                                    className={`filter-button ${filterScore === score ? 'active' : ''}`}
                                    onClick={() => handleFilterChange(score)}
                                >
                                    {score}
                                </button>
                            ))}
                            {filterScore && (
                                <button 
                                    className="filter-button clear"
                                    onClick={() => setFilterScore('')}
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="score-legend">
                        <h3>Score Legend:</h3>
                        <div className="legend-items">
                            {['A', 'B', 'C', 'D', 'E'].map(score => (
                                <div key={score} className="legend-item">
                                    <NutritionScore score={score} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <FoodList foods={filteredFoods} />
                </>
            )}
        </main>
    );
}