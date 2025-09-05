const apiUrl = "https://crud-db-standard.azurewebsites.net/api/ProductFunction";

// --- Create or Update ---
async function createOrUpdate(action) {
    const product = {
        id: document.getElementById("id").value,
        Name: document.getElementById("name").value,
        Category: document.getElementById("Category").value,
        Price: document.getElementById("price").value
    };

    let method = action === "create" ? "POST" : "PUT";

    const res = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });

    document.getElementById("output").innerText = await res.text();
    loadAllProducts();
}

// --- Read Product ---
async function readProduct() {
    const id = document.getElementById("readId").value;
    const category = document.getElementById("readCategory").value;
    const res = await fetch(`${apiUrl}?id=${id}&Category=${category}`);
    const data = await res.json();
    document.getElementById("output").innerText = JSON.stringify(data, null, 2);
}

// --- Delete Product ---
async function deleteProduct() {
    const id = document.getElementById("readId").value;
    const category = document.getElementById("readCategory").value;
    const res = await fetch(`${apiUrl}?id=${id}&Category=${category}`, { method: "DELETE" });
    document.getElementById("output").innerText = await res.text();
    loadAllProducts();
}

// --- Load All Products (Table) ---
async function loadAllProducts() {
    const res = await fetch(apiUrl); // simple GET without params → return all
    let products = [];
    try {
        products = await res.json();
    } catch (e) {
        console.error("Error parsing products:", e);
    }

    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = "";

    if (Array.isArray(products)) {
        products.forEach(p => {
            const row = `<tr>
                <td>${p.id}</td>
                <td>${p.Name}</td>
                <td>${p.Category}</td>
                <td>${p.Price}</td>
            </tr>`;
            tbody.insertAdjacentHTML("beforeend", row);
        });
    }
}

// Load products when page starts
window.onload = loadAllProducts;

