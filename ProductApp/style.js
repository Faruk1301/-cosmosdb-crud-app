const apiUrl = "https://crud-db-epcdgkf2g5ayb5az.centralindia-01.azurewebsites.net/api/products";

// Fetch all products dynamically (for demo, list products in each category)
async function fetchAllProducts() {
    // List categories (you can modify to fetch dynamically if you store category list)
    const categories = ["Electronics", "Clothing", "Books"];
    const tableBody = document.querySelector("#productsTable tbody");
    tableBody.innerHTML = "";

    for (const category of categories) {
        // Fetch items by category (read one by one - Cosmos DB requires partition key)
        const res = await fetch(`${apiUrl}?action=read&id=${category}&category=${category}`);
        const data = await res.json().catch(() => null);
        if (data && data.id) {
            const row = `<tr>
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.Category}</td>
                <td>${data.price}</td>
                <td>
                    <button onclick="populateForm('${data.id}','${data.name}','${data.Category}',${data.price})">Edit</button>
                    <button onclick="deleteProduct('${data.id}','${data.Category}')">Delete</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        }
    }
}

// Populate form for editing
function populateForm(id, name, category, price) {
    document.getElementById('id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('category').value = category;
    document.getElementById('price').value = price;
}

// Create Product
async function createProduct() {
    const product = getFormData("create");
    const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    document.getElementById('output').innerText = await res.text();
    fetchAllProducts();
}

// Update Product
async function updateProduct() {
    const product = getFormData("update");
    const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    document.getElementById('output').innerText = await res.text();
    fetchAllProducts();
}

// Delete Product
async function deleteProduct(id, category) {
    const res = await fetch(`${apiUrl}?action=delete&id=${id}&category=${category}`, {
        method: "DELETE"
    });
    document.getElementById('output').innerText = await res.text();
    fetchAllProducts();
}

// Get form data
function getFormData(action) {
    return {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        Category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        action: action
    };
}

// Initial load
fetchAllProducts();

