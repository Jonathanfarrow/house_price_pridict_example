import fs from 'fs';

function generateHouses(numRecords = 600) {
    const streets = ['Main St', 'Oak Ave', 'Pine Ln', 'Maple Dr', 'Cedar Ct', 'Birch St', 
                    'Willow Way', 'Elm Rd', 'Park Ave', 'Lake St', 'Forest Dr', 'River Rd', 
                    'Mountain View', 'Sunset Blvd', 'Highland Ave'];
    
    const neighborhoods = ['Residential', 'Suburban', 'Urban', 'Downtown', 'Historic', 
                         'Waterfront', 'University District', 'Arts District', 
                         'Business District', 'Garden District'];

    const houses = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < numRecords; i++) {
        const sqft = Math.floor(Math.random() * (5000 - 800 + 1)) + 800;
        const rooms = Math.floor(Math.random() * 7) + 1;
        // Base price calculation using sqft and rooms
        let basePrice = (sqft * 200) + (rooms * 25000);
        // Add some random variation
        basePrice = basePrice * (0.8 + Math.random() * 0.4);
        
        const house = {
            address: `${Math.floor(Math.random() * 9900) + 100} ${streets[Math.floor(Math.random() * streets.length)]}`,
            sqft: sqft,
            yearBuilt: Math.floor(Math.random() * (currentYear - 1950 + 1)) + 1950,
            rooms: rooms,
            parking: Math.random() > 0.3 ? "Yes" : "No", // 70% chance of having parking
            neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
            furnished: Math.random() > 0.5, // 50% chance of being furnished
            price: Math.round(basePrice / 1000) * 1000 // Round to nearest thousand
        };
        houses.push(house);
    }

    const data = { houses };
    fs.writeFileSync('houses.json', JSON.stringify(data, null, 2));
    console.log(`Generated ${numRecords} house records in houses.json`);
}

generateHouses();