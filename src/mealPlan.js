const axios = require('axios');
const fs = require('fs');

// Function to make an API request to retrieve recipes based on criteria
async function getRecipes(criteria) {
    const options = {
        method: 'GET',
        url: 'https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2',
        params: {

        },
        headers: {
            'Accept-Language': 'en',
            'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your RapidAPI key
            'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return { hits: [] };
    }
}

// Function to generate a meal plan
async function generateMealPlan(userCalories) {
    const mealPlan = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
    };

    // Define criteria for each meal (modify as needed)
    const mealCriteria = {
        breakfast: {
            type: 'public',
            mealType: ['Breakfast'],
            calories: `${userCalories * 0.25}-${userCalories * 0.3}`,
            random: true,
        },
        lunch: {
            type: 'public',
            mealType: ['Lunch'],
            calories: `${userCalories * 0.3}-${userCalories * 0.4}`,
            random: true,
        },
        dinner: {
            type: 'public',
            mealType: ['Dinner'],
            calories: `${userCalories * 0.3}-${userCalories * 0.4}`,
            random: true,
        },
        snacks: {
            type: 'public',
            mealType: ['Snacks'],
            calories: `${userCalories * 0.05}-${userCalories * 0.1}`,
            random: true,
        },
    };

    // Retrieve and store recipes for each meal
    for (const meal in mealCriteria) {
        const criteria = mealCriteria[meal];
        const recipes = await getRecipes(criteria);
        mealPlan[meal] = recipes.hits.map((hit) => ({
            name: hit.recipe.label,
            url: hit.recipe.url,
            calories: Math.round(hit.recipe.calories),
        }));
    }

    return mealPlan;
}

// Calculate user's calorie needs (replace this with your logic)
const userCalories = 2000;

// Generate the meal plan based on user's calories
generateMealPlan(userCalories).then((mealPlan) => {
    // Write the meal plan data to mealPlan.json
    fs.writeFile('mealPlan.json', JSON.stringify(mealPlan, null, 2), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Meal plan saved to mealPlan.json');
        }
    });
});
