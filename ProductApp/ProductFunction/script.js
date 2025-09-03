const apiUrl = "https://crud-db-epcdgkf2g5ayb5az.centralindia-01.azurewebsites.net/api/products";

async function createProduct() {
    const product = {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        Category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        action: "create"
    };
    const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    document.getElementById('output').innerText = await res.text();
}

async function updateProduct() {
    const product = {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        Category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        action: "update"
    };
    const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    document.getElementById('output').innerText = await res.text();
}

async function readProduct() {
    const id = document.getElementById('readId').value;
    const category = document.getElementById('readCategory').value;
    const res = await fetch(`${apiUrl}?action=read&id=${id}&category=${category}`);
    const data = await res.json().catch(() => ({ message: "Product not found" }));
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}

async function deleteProduct() {
    const id = document.getElementById('readId').value;
    const category = document.getElementById('readCategory').value;
    const res = await fetch(`${apiUrl}?action=delete&id=${id}&category=${category}`, {
        method: "DELETE"
    });
    document.getElementById('output').innerText = await res.text();
}

