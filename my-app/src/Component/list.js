import React, { Component, useState } from 'react';
import data from '../Facebook.json';
import axios from 'axios';

class NewList extends Component {
    // Create a contructor. This code is run every time the NewList Component is created
    componentDidMount() {
        this.getLanguages();
    }

    // Create 4 states:
    // - original_data      | the data that is read from the json file
    // - translated_data    | this is where the translated data is stored
    // - languages          | this is where all the possible languages are stored
    // - selected_language  | this is the language that will be translated to
    state = {
        original_data: data,
        translated_data: [],
        languages: [],
        selected_language: 'en'
    }

    // function for translating the given text parameter
    translate = async (text) => {
        // Create an object for the input variables
        var input = {
            q: text,
            source: 'nl',
            target: this.state.selected_language
        }

        // Run an axios post request. IF it is succesfull, THEN save the response to the output const. ELSE, console log the error
        const output = await axios.post('http://77.170.152.133:5000/translate', input).then(response => {
            return response.data.translatedText;
        }).catch(response => {
            console.log(response)
        })

        // Return the translated text
        return output;
    }

    // Main function for chancing the language
    changeLanguage = async () => {
        // Create a new empty array that will be filled
        var translated_array = [];

        // Loop through the original data and translate title and description. Copy the rest and put them into the 
        const x = await Promise.all(this.state.original_data.map(async (record) => {
            var _title = await this.translate(record.title);
            var _description = await this.translate(record.description);

            //Push the data to the array
            translated_array.push({
                id: record.id,
                title: _title,
                description: _description,
                datecreated: record.datecreated,
                dateevent: record.dateevent,
                adress: {
                    street: record.adress.street,
                    province: record.adress.province,
                    city: record.adress.city,
                    country: record.adress.country
                },
                ages: record.ages,
                languages: record.languages,
                source: record.source
            })

        }));

        // Sort the array based on ID
        translated_array.sort((a, b) => {
            return a.id - b.id
        });

        //Console.log succes if translation complete
        console.log('translation succesfull!');

        // Save the translated array to the state
        this.setState({ translated_data: translated_array })
    };

    // Function for getting all the possible languages
    getLanguages = async () => {
        // Axios get request. IF succesfull, THEN save the data to output const. ELSE, console log the error
        const output = await axios.get('http://77.170.152.133:5000/languages').then(response => {
            return response.data;
        }).catch(response => {
            console.log(response)
        })

        // Save the output to the state
        this.setState({ languages: output })
    }

    render() {
        //Create variable for dynamic rendering
        let content;

        // IF the languages have not yet been loaded, show the user a loading screen
        if (this.state.languages.length === 0) {
            content = <h1>Loading...</h1>
        }

        // If there is no translated data, use the orginal data 
        else if (this.state.translated_data.length === 0) {
            content =
                <>
                    {/* Loop through the original data to show title, description and date */}
                    {this.state.original_data.map((record) =>
                        <ul>
                            <li className="Title" key="title"> {record.title}</li>
                            <li className="Desc" key="description"> {record.description}</li>
                            <li className="Date" key="date">{record.dateevent}</li>
                        </ul>
                    )}

                    {/* Create a dropdown menu by looping through the possible languages and creating <option> for every one */}
                    <select value={this.state.selected_language} onChange={(e) => this.setState({ selected_language: e.target.value })}>
                        {this.state.languages.map((record) =>
                            <option value={record.code}>{record.name}</option>
                        )}
                    </select>

                    {/* A button for changing the language */}
                    <button onClick={this.changeLanguage}>VERTAAL</button>
                </>

        }

        // IF there is new translated data, use this
        else {
            content =
                <>
                    {/* Loop through the translated data to show title, description and date */}
                    {this.state.translated_data.map((record) =>
                        <ul>
                            <li className="Title" key="title"> {record.title}</li>
                            <li className="Desc" key="description"> {record.description}</li>
                            <li className="Date" key="date">{record.dateevent}</li>
                        </ul>
                    )}

                    {/* Create a dropdown menu by looping through the possible languages and creating <option> for every one */}
                    <select value={this.state.selected_language} onChange={(e) => this.setState({ selected_language: e.target.value })}>
                        {this.state.languages.map((record) =>
                            <option value={record.code}>{record.name}</option>
                        )}
                    </select>

                    {/* A button for changing the language */}
                    <button onClick={this.changeLanguage}>VERTAAL</button>
                </>
        }
        return content;
    }
}

// Export as component
export default NewList;