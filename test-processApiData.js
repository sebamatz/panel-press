// Test for processApiData function
const testApiData = [
    {
        "sku": "1100",
        "webName": null,
        "xdocname": ""
    },
    {
        "sku": "1104",
        "webName": null,
        "xdocname": ""
    },
    {
        "sku": "1112-B1",
        "webName": null,
        "xdocname": ""
    },
    {
        "sku": "1120",
        "webName": null,
        "xdocname": ""
    },
    {
        "sku": "1160",
        "webName": null,
        "xdocname": ""
    },
    {
        "sku": "1240",
        "webName": null,
        "xdocname": ""
    }
];

// Mock processApiData function (copy from the actual implementation)
function processApiData(apiData) {
    console.log("Processing API data:", apiData);

    let processedItems = [];

    // If apiData is an array, use it directly
    if (Array.isArray(apiData)) {
        processedItems = apiData.map((item, index) => ({
            id: item.sku || item.id || item.ID || index + 1,
            name: item.webName || item.name || item.Name || item.title || item.Title || `Product ${item.sku || index + 1}`,
            description: item.xdocname || item.description || item.Description || item.desc || "",
            code: item.sku || item.code || item.Code || "",
            ...item, // Include all other properties
        }));
    }

    console.log("Processed items:", processedItems);
    return processedItems;
}

// Test the function
const result = processApiData(testApiData);
console.log("\n=== TEST RESULTS ===");
console.log("Input data length:", testApiData.length);
console.log("Output data length:", result.length);
console.log("\nFirst processed item:", result[0]);
console.log("\nAll processed items:");
result.forEach((item, index) => {
    console.log(`${index + 1}. ID: ${item.id}, Name: ${item.name}, Code: ${item.code}`);
}); 