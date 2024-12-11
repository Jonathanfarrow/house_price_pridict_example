import rawHouses from "./houses.json" assert { type: "json" };
import xgboost from 'xgboost_node';

const features = rawHouses.houses.map(house => [
    house.sqft,
    new Date().getFullYear() - house.yearBuilt,  // Convert year built to age
    house.rooms,
    house.parking === "Yes" ? 1 : 0,             // Convert Yes/No to 1/0
    house.neighborhood === "Residential" ? 1 : 2, // Convert category to number
    house.furnished ? 1 : 0                       // Convert boolean to 1/0
]);

console.log("Sample features:", features[0]);

const labels = rawHouses.houses.map(house => house.price / 1000); 

console.log("Sample label:", labels[0]);

async function test() {
    const params = {
        max_depth: 3,
        eta: 0.3,
        objective: 'reg:squarederror',
        eval_metric: 'rmse',
        nthread: 4,
        num_round: 100,
        min_child_weight: 1,
        subsample: 0.8,
        colsample_bytree: 0.8,
    };

    try {
        await xgboost.train(features, labels, params);
        
        const predictions = await xgboost.predict(features);
        
        let totalError = 0;
        const errors = [];
        let successfulPredictions = 0;

        for (let i = 0; i < predictions.length; i++) {
            const predicted = predictions[i];
            const actual = labels[i];
            
            if (actual && predicted) {
                const error = Math.abs(predicted - actual) / actual * 100;
                totalError += error;
                errors.push(error);
                successfulPredictions++;
            }
        }

        // Calculate statistics
        const averageError = totalError / successfulPredictions;
        const medianError = errors.sort((a, b) => a - b)[Math.floor(errors.length / 2)];

        const report = {
            sampleSize: features.length,
            successfulPredictions,
            averageError: averageError.toFixed(2) + '%',
            medianError: medianError.toFixed(2) + '%',
            errorDistribution: {
                under10Percent: errors.filter(e => e < 10).length,
                under20Percent: errors.filter(e => e < 20).length,
                under50Percent: errors.filter(e => e < 50).length,
                over50Percent: errors.filter(e => e >= 50).length
            }
        };

        console.log('Model Evaluation Report:', report);

        // Make some example predictions
        const exampleHouses = [
            [1000, 0, 1, 0, 1, 1],  // Small house
            [2500, 10, 3, 1, 1, 1], // Medium house
            [4000, 5, 5, 1, 1, 1]   // Large house
        ];

        const examplePredictions = await xgboost.predict(exampleHouses);
        console.log('\nExample Predictions:');
        exampleHouses.forEach((house, index) => {
            console.log(`House ${index + 1} (${house[0]} sqft, ${house[2]} rooms): $${(examplePredictions[index] * 1000).toFixed(2)}`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the test
console.log("Starting model training and evaluation...");
test().then(() => {
    console.log("Testing completed.");
}).catch(error => {
    console.error("Testing failed:", error);
});