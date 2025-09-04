const apiUrl = "https://crud-db.azurewebsites.net/api/ProductFunction";

// Example: Get all products
async function getProducts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data); // you can populate HTML table
    } catch (error) {
        console.error(error);
    }
}

// Example: Add product
async function addProduct(product) {
    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
        getProducts(); // refresh table
    } catch (error) {
        console.error(error);
    }
}

// Call getProducts on page load
window.onload = getProducts;

