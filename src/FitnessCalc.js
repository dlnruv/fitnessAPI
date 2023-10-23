import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

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
        selectedMealType: null,
        selectedRecipe: null,
    };

    openRecipeModal = (recipe) => {
        this.setState({ selectedRecipe: recipe });
    };

    closeRecipeModal = () => {
        this.setState({ selectedRecipe: null });
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
                    calorieRange = `${calorieMaintenance * 0.20}-${calorieMaintenance * 0.25}`;
                    break;
                case 'lunch':
                    calorieRange = `${calorieMaintenance * 0.30}-${calorieMaintenance * 0.35}`;
                    break;
                case 'dinner':
                    calorieRange = `${calorieMaintenance * 0.30}-${calorieMaintenance * 0.35}`;
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
                        'field[0]': 'uri',
                        random: 'true',
                        'imageSize[0]': 'LARGE',
                        calories: calorieRange,
                        'mealType[0]': mealType,
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
                    this.setState({ recipeData: updatedRecipeData, selectedMealType: mealType });
                } catch (error) {
                    console.error(error);
                    this.setState({ error: 'An error occurred while fetching recipes.', recipeData: null, selectedMealType: null });
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
                'X-RapidAPI-Key': '28622ab15emsh37de7c04fb42d0bp134858jsnbee14dcb0847',
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
        const { responseData, error, recipeData, selectedMealType ,selectedRecipe} = this.state;
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
                    <button type="submit">Get Info</button>
                    <p></p>
                    <button type="button" onClick={() => this.handleMealTypeChange('breakfast')}>
                        Get Breakfast Recipes
                    </button>
                    <button type="button" onClick={() => this.handleMealTypeChange('lunch')}>
                        Get Lunch Recipes
                    </button>
                    <button type="button" onClick={() => this.handleMealTypeChange('dinner')}>
                        Get Dinner Recipes
                    </button>
                </form>

                {responseData && (
                    <div>
                        <h2>Calorie Requirements:</h2>
                        <p>Caloric Maintenance: {calorieMaintenance}</p>
                    </div>
                )}
                {selectedMealType && recipeData[selectedMealType].length > 0 && (
                    <div>
                        <h2>{selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Recipes: </h2>
                        <h2>Calorie Range: {this.getCalorieRange(selectedMealType)} </h2>
                        <ul>
                            {recipeData[selectedMealType].map((recipe, index) => (
                                <li key={index}>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => this.openRecipeModal(recipe)}
                                    >
                                        {recipe.recipe.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Modal
                    isOpen={selectedRecipe !== null}
                    onRequestClose={this.closeRecipeModal}
                    contentLabel="Recipe Modal"
                >
                    {selectedRecipe && (
                        <div>
                            <h2>{selectedRecipe.recipe.label}</h2>
                            <img src={selectedRecipe.recipe.image} alt={selectedRecipe.recipe.label} />
                            <h3>Nutritional Information:</h3>
                            <ul>
                                <li>Calories: {Math.round(selectedRecipe.recipe.totalNutrients.ENERC_KCAL.quantity)} {selectedRecipe.recipe.totalNutrients.ENERC_KCAL.unit}</li>
                                <li>Fat: {Math.round(selectedRecipe.recipe.totalNutrients.FAT.quantity)} {selectedRecipe.recipe.totalNutrients.FAT.unit}</li>
                                <li>Carbs: {Math.round(selectedRecipe.recipe.totalNutrients.CHOCDF.quantity)} {selectedRecipe.recipe.totalNutrients.CHOCDF.unit}</li>
                                <li>Protein: {Math.round(selectedRecipe.recipe.totalNutrients.PROCNT.quantity)} {selectedRecipe.recipe.totalNutrients.PROCNT.unit}</li>
                            </ul>
                            <button onClick={this.closeRecipeModal}>Close</button>
                            <a href={selectedRecipe.recipe.url} target="_blank">Show Recipe</a>
                        </div>
                    )}
                </Modal>
            </div>
        );
    }
    getCalorieRange(mealType) {
        const calorieMaintenance = this.getCalorieMaintenance();
        if (calorieMaintenance) {
            switch (mealType) {
                case 'breakfast':
                    return `${Math.round(calorieMaintenance * 0.20)} - ${Math.round(calorieMaintenance * 0.25)} calories`;
                case 'lunch':
                    return `${Math.round(calorieMaintenance * 0.30)} - ${Math.round(calorieMaintenance * 0.35)} calories`;
                case 'dinner':
                    return `${Math.round(calorieMaintenance * 0.30)} - ${Math.round(calorieMaintenance * 0.35)} calories`;
                default:
                    return '';
            }
        }
        return '';
    }

}

export default FitnessCalc;


