import React, { Component } from 'react';
import axios from 'axios';

class FitnessCalc extends Component {
    state = {
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        activityLevel: 'level_1',
        selectedGoal: 'maintain weight',
        responseData: null,
        recipeData: {
            breakfast: [],
            lunch: [],
            dinner: [],
        },
        error: null,
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleGoalChange = (e) => {
        this.setState({ selectedGoal: e.target.value });
    };

    handleMealTypeChange = async (mealType) => {
        if (!this.state.responseData) {
            return;
        }

        const calorieMaintenance = this.getCalorieMaintenance();

        if (calorieMaintenance) {
            let calorieRange = '';
            switch (mealType) {
                case 'breakfast':
                    calorieRange = `${calorieMaintenance - 200}-${calorieMaintenance - 100}`;
                    break;
                case 'lunch':
                    calorieRange = `${calorieMaintenance - 100}-${calorieMaintenance + 100}`;
                    break;
                case 'dinner':
                    calorieRange = `${calorieMaintenance + 100}-${calorieMaintenance + 200}`;
                    break;
                default:
                    break;
            }

            if (calorieRange) {
                const recipeOptions = {
                    method: 'GET',
                    url: 'https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2',
                    params: {
                        type: 'public',
                        co2EmissionsClass: 'A+',
                        'field[0]': 'uri',
                        beta: 'true',
                        random: 'true',
                        'imageSize[0]': 'LARGE',
                        calories: calorieRange,
                        'diet[0]': 'balanced',
                    },
                    headers: {
                        'Accept-Language': 'en',
                        'X-RapidAPI-Key': '28622ab15emsh37de7c04fb42d0bp134858jsnbee14dcb0847',
                        'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com',
                    },
                };

                try {
                    const recipeResponse = await axios.request(recipeOptions);
                    const updatedRecipeData = { ...this.state.recipeData, [mealType]: recipeResponse.data.hits };
                    this.setState({ recipeData: updatedRecipeData });
                } catch (error) {
                    console.error(error);
                    this.setState({ error: 'An error occurred while fetching recipes.', recipeData: null });
                }
            }
        }
    };

    getCalorieMaintenance() {
        const { responseData, selectedGoal } = this.state;
        if (responseData) {
            if (selectedGoal === 'maintain weight') {
                return responseData.data.goals[selectedGoal];
            } else {
                return responseData.data.goals[selectedGoal].calory;
            }
        }
        return null;
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const options = {
            method: 'GET',
            url: 'https://fitness-calculator.p.rapidapi.com/dailycalorie',
            params: {
                age: this.state.age,
                gender: this.state.gender,
                height: this.state.height,
                weight: this.state.weight,
                activitylevel: this.state.activityLevel,
            },
            headers: {
                'X-RapidAPI-Key': '28622ab15emsh37de7c04fb42d0bp134858jsnbee14dcb0847', // Replace with your API key
                'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com',
            },
        };

        try {
            const response = await axios.request(options);
            this.setState({ responseData: response.data, error: null });
        } catch (error) {
            console.error(error);
            this.setState({ error: 'An error occurred while fetching data.', responseData: null });
        }
    }

    render() {
        const { responseData, error, recipeData, selectedMealType } = this.state; // Corrected the variable name
        const calorieMaintenance = this.getCalorieMaintenance();

        return (
            <div>
                <h1>Fitness Calculator</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Age:
                        <input type="number" name="age" value={this.state.age} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Gender:
                        <select name="gender" value={this.state.gender} onChange={this.handleInputChange}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </label>
                    <label>
                        Height (in cm):
                        <input type="number" name="height" value={this.state.height} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Weight (in kg):
                        <input type="number" name="weight" value={this.state.weight} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Activity Level:
                        <select name="activityLevel" value={this.state.activityLevel} onChange={this.handleInputChange}>
                            <option value="level_1">Sedentary: little or no exercise</option>
                            <option value="level_2">Exercise 1-3 times/week</option>
                            <option value="level_3">Exercise 4-5 times/week</option>
                            <option value="level_4">Daily exercise or intense exercise 3-4 times/week</option>
                            <option value="level_5">Intense exercise 6-7 times/week</option>
                            <option value="level_6">Very intense exercise daily, or physical job</option>
                        </select>
                    </label>
                    <label>
                        Weight Management Goal:
                        <select name="selectedGoal" value={this.state.selectedGoal} onChange={this.handleGoalChange}>
                            <option value="maintain weight">Maintain Weight</option>
                            <option value="Mild weight loss">Mild Weight Loss</option>
                            <option value="Weight loss">Weight Loss</option>
                            <option value="Extreme weight loss">Extreme Weight Loss</option>
                            <option value="Mild weight gain">Mild Weight Gain</option>
                            <option value="Weight gain">Weight Gain</option>
                            <option value="Extreme weight gain">Extreme Weight Gain</option>
                        </select>
                    </label>
                    <button type="button" onClick={() => this.handleMealTypeChange('breakfast')}>
                        Get Breakfast Recipes
                    </button>
                    <button type="button" onClick={() => this.handleMealTypeChange('lunch')}>
                        Get Lunch Recipes
                    </button>
                    <button type="button" onClick={() => this.handleMealTypeChange('dinner')}>
                        Get Dinner Recipes
                    </button>
                    <button type="submit">Get Info</button>
                </form>

                {responseData && (
                    <div>
                        <h2>Calorie Requirements:</h2>
                        <p>Caloric Maintenance: {calorieMaintenance}</p>
                    </div>
                )}

                {recipeData[selectedMealType] && recipeData[selectedMealType].length > 0 && (
                    <div>
                        <h2>{selectedMealType === 'breakfast' ? 'Breakfast Recipes' : selectedMealType === 'lunch' ? 'Lunch Recipes' : 'Dinner Recipes'}</h2>
                        {recipeData[selectedMealType].slice(0, 5).map((recipe, index) => (
                            <div key={index}>
                                <h3>{recipe.recipe.label}</h3>
                                <img src={recipe.recipe.image} alt={recipe.recipe.label} />
                                <p>Yield: {recipe.recipe.yield}</p>
                                <p>Diet Labels: {recipe.recipe.dietLabels.join(', ')}</p>
                                <p>Health Labels: {recipe.recipe.healthLabels.join(', ')}</p>
                                <p>Ingredients:</p>
                                <ul>
                                    {recipe.recipe.ingredientLines.map((ingredient, i) => (
                                        <li key={i}>{ingredient}</li>
                                    ))}
                                </ul>
                                <p>
                                    <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer">
                                        See full recipe
                                    </a>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default FitnessCalc;
