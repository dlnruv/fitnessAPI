import React, { Component } from 'react';
import axios from 'axios';

class FitnessCalc extends Component {
    state = {
        age: '',
        gender: 'male',
        height: '', // Add height field
        weight: '', // Add weight field
        activityLevel: 'level_1',
        responseData: null,
        error: null,
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const options = {
            method: 'GET',
            url: 'https://fitness-calculator.p.rapidapi.com/dailycalorie',
            params: {
                age: this.state.age,
                gender: this.state.gender,
                height: this.state.height, // Use height from state
                weight: this.state.weight, // Use weight from state
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
    };

    render() {
        const { responseData, error } = this.state;

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
                        Height (in cm): {/* Add height input field */}
                        <input type="number" name="height" value={this.state.height} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Weight (in kg): {/* Add weight input field */}
                        <input type="number" name="weight" value={this.state.weight} onChange={this.handleInputChange} />
                    </label>
                    <label>
                        Activity Level:
                        <select name="activityLevel" value={this.state.activityLevel} onChange={this.handleInputChange}>
                            <option value="level_1">Level 1</option>
                            <option value="level_2">Level 2</option>
                            {/* Add more options for different activity levels */}
                        </select>
                    </label>
                    <button type="submit">Get Info</button>
                </form>

                {responseData && (
                    <div>
                        <h2>Calorie Requirements:</h2>
                        <p>Basal Metabolic Rate (BMR): {responseData.bmr}</p>
                        <p>Caloric Maintenance: {responseData.maintenance}</p>
                    </div>
                )}

                {error && <p>{error}</p>}
            </div>
        );
    }
}

export default FitnessCalc;
