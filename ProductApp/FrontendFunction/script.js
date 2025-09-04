const apiUrl = "https://crud-db-standard.azurewebsites.net/api/ProductFunction";

// CREATE product
async function createProduct() {
    const product = {
        id: document.getElementById("id").value,
        Name: document.getElementById("name").value,
        Category: document.getElementById("category").value,
        Price: document.getElementById("price").value
    };
    const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    document.getElementById("output").innerText = await res.text();
}

// UPDATE product
async function updateProduct() {
    const product = {
        id: document.getElementById("id").value,
        Name: document.getElementById("name").value,
        Category: document.getElementById("category").value,
        Price: document.getElementById("price").value
    };
    const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    document.getElementById("output").innerText = await res.text();
}

// READ product
async function readProduct() {
    const id = document.getElementById("readId").value;
    const category = document.getElementById("readCategory").value;
    const res = await fetch(`${apiUrl}?id=${id}&category=${category}`, { method: "GET" });
    const data = await res.json();
    document.getElementById("output").innerText = JSON.stringify(data, null, 2);
}

// DELETE product
async function deleteProduct() {
    const id = document.getElementById("readId").value;
    const category = document.getElementById("readCategory").value;
    const res = await fetch(`${apiUrl}?id=${id}&category=${category}`, { method: "DELETE" });
    document.getElementById("output").innerText = await res.text();
}
