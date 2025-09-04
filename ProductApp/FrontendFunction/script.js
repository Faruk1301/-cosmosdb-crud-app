
const apiUrl = "https://crud-db-standard.azurewebsites.net/api/ProductFunction";

async function createOrUpdate(action) {
    const product = {
        id: document.getElementById("id").value,
        Name: document.getElementById("name").value,
        Category: document.getElementById("category").value,
        Price: document.getElementById("price").value,
        action: action
    };
    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    document.getElementById("output").innerText = `${action} operation done`;
}

async function readProduct() {
    const id = document.getElementById("readId").value;
    const category = document.getElementById("readCategory").value;
    const res = await fetch(`${apiUrl}?action=read&id=${id}&category=${category}`);
    const data = await res.json();
    document.getElementById("output").innerText = JSON.stringify(data, null, 2);
}

async function deleteProduct() {
    const id = document.getElementById("readId").value;
    const category = document.getElementById("readCategory").value;
    await fetch(`${apiUrl}?action=delete&id=${id}&category=${category}`);
    document.getElementById("output").innerText = `Deleted ${id}`;
}


