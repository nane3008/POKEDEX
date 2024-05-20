
const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

    document.addEventListener('DOMContentLoaded', async function () {
        const pokemonContainer = document.getElementById('pokemon-container');
        const modalContainer = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const addPokemonForm = document.getElementById('add-pokemon-form');
        const addPokemonBtn = document.getElementById('addPokemonBtn');
    
        let allPokemon = [];
        let filteredPokemon = [];
    
        // Fetch the list of all Pokémon
        const allPokemonResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        allPokemon = await allPokemonResponse.json();
    
        // Fetch details for each Pokémon
        const detailedPokemonPromises = allPokemon.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            return await pokemonResponse.json();
        });
    
        allPokemon = await Promise.all(detailedPokemonPromises);
    
        // Sort Pokémon by index number
        allPokemon.sort((a, b) => a.id - b.id);
    
        // Display the sorted Pokémon
        displayPokemonList(allPokemon, pokemonContainer);
    
        // Populate the type filter dropdown
        const allTypes = getAllTypes(allPokemon);
        populateTypeFilterDropdown(allTypes, typeFilter);
    
        // Add input event listener to the search bar
        searchInput.addEventListener('input', function () {
            updateFilteredPokemon();
        });
    
        // Add change event listener to the type filter dropdown
        typeFilter.addEventListener('change', function () {
            updateFilteredPokemon();
        });
    
        // Add click event listener to each Pokemon card
        pokemonContainer.addEventListener('click', function (event) {
            const clickedPokemonId = event.target.dataset.pokemonId;
            const clickedPokemon = allPokemon.find(pokemon => pokemon.id == clickedPokemonId);
    
            // Display details in the modal
            displayPokemonDetails(clickedPokemon, modalContent);
    
            // Show the modal
            modalContainer.style.display = 'flex';
        });
    
        // Close modal when clicking outside the modal content
        modalContainer.addEventListener('click', function (event) {
            if (event.target === modalContainer) {
                modalContainer.style.display = 'none';
            }
        });
        function updateFilteredPokemon() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedType = typeFilter.value.toLowerCase();
    
            // Filter Pokémon based on search term and selected type
            filteredPokemon = allPokemon.filter(pokemon =>
                (pokemon.name.toLowerCase().includes(searchTerm) || pokemon.id.toString().includes(searchTerm)) &&
                (selectedType === '' || pokemon.types.some(type => type.type.name.toLowerCase() === selectedType))
            );
    
            // Display the filtered Pokémon
            displayPokemonList(filteredPokemon, pokemonContainer);
        }
    });
        // Add event listener to the Add Pokémon button
        addPokemonBtn.addEventListener('click', function () {
            const pokemonName = document.getElementById('pokemonName').value.trim();
            const pokemonImage = document.getElementById('pokemonImage').value.trim();
            const pokemonType = document.getElementById('pokemonType').value.trim();
    
            if (pokemonName && pokemonImage && pokemonType) {
                // Create a new Pokémon object
                const newPokemon = {
                    name: pokemonName,
                    sprites: {
                        front_default: pokemonImage
                    },
                    types: [{ type: { name: pokemonType } }]
                };
    
                // Add the new Pokémon to the list
                allPokemon.push(newPokemon);
    
                // Update the displayed Pokémon list
                updateFilteredPokemon();
    
                // Clear the form fields
                document.getElementById('pokemonName').value = '';
                document.getElementById('pokemonImage').value = '';
                document.getElementById('pokemonType').value = '';
            } else {
                alert('Please fill in all fields.');
            }
        });
  
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function displayPokemonList(pokemonList, container) {
        // Clear previous content
        container.innerHTML = '';
    
        pokemonList.forEach((pokemon) => {
            // Create a card for each Pokemon
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');
            pokemonCard.dataset.pokemonId = pokemon.id; // Set dataset for later identification
    
            // Display the Pokemon name with the first letter capitalized
            const pokemonName = document.createElement('h3');
            pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
            pokemonCard.appendChild(pokemonName);
    
            // Display the Pokemon image
            const pokemonImage = document.createElement('img');
            pokemonImage.classList.add('pokemon-image');
            pokemonImage.src = pokemon.sprites.front_default;
            pokemonImage.alt = `${pokemon.name} sprite`;
            pokemonCard.appendChild(pokemonImage);
    
            // Display the Pokemon types
            const pokemonTypesContainer = document.createElement('div');
            pokemonTypesContainer.classList.add('pokemon-types');
    
            pokemon.types.forEach((type) => {
                const typeElement = document.createElement('span');
                typeElement.classList.add('pokemon-type');
                typeElement.textContent = capitalizeFirstLetter(type.type.name);
                typeElement.style.backgroundColor = typeColors[type.type.name.toLowerCase()];

                pokemonTypesContainer.appendChild(typeElement);
            });
    
            pokemonCard.appendChild(pokemonTypesContainer);
    
            // Append the card to the container
            container.appendChild(pokemonCard);
        });
    }
    
    function displayPokemonDetails(pokemon, container) {
        // Clear previous content
        container.innerHTML = '';
    
        // Display detailed information in the modal
        const pokemonName = document.createElement('h2');
        pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
        container.appendChild(pokemonName);
    
        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.sprites.front_default;
        pokemonImage.alt = `${pokemon.name} sprite`;
        container.appendChild(pokemonImage);
    
        const pokemonTypes = document.createElement('p');
        pokemonTypes.textContent = `Types: ${pokemon.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}`;
        container.appendChild(pokemonTypes);
    }
    
    function getAllTypes(pokemonList) {
        const typesSet = new Set();
        pokemonList.forEach(pokemon => {
            pokemon.types.forEach(type => {
                typesSet.add(type.type.name.toLowerCase());
            });
        });
        return Array.from(typesSet);
    }
    
    function populateTypeFilterDropdown(types, dropdown) {
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = capitalizeFirstLetter(type);
            dropdown.appendChild(option);
        });
    }
    
    function updateFilteredPokemon() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value.toLowerCase();
    
        // Filter Pokémon based on search term and selected type
        filteredPokemon = allPokemon.filter(pokemon =>
            (pokemon.name.toLowerCase().includes(searchTerm) || pokemon.id.toString().includes(searchTerm)) &&
            (selectedType === '' || pokemon.types.some(type => type.type.name.toLowerCase() === selectedType))
        );
    
        // Display the filtered Pokémon
        displayPokemonList(filteredPokemon, pokemonContainer);
    }
    