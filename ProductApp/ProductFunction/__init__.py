import logging
import azure.functions as func
import json
import os
from azure.cosmos import CosmosClient, exceptions

# Cosmos DB config (from Function App Application Settings)
URL = os.environ["COSMOS_URL"]
KEY = os.environ["COSMOS_KEY"]
DATABASE_NAME = os.environ["DATABASE_NAME"]
CONTAINER_NAME = os.environ["CONTAINER_NAME"]

client = CosmosClient(URL, credential=KEY)
database = client.get_database_client(DATABASE_NAME)
container = database.get_container_client(CONTAINER_NAME)

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        method = req.method

        if method == "POST":
            return create_product(req)
        elif method == "GET":
            return read_product(req)
        elif method == "PUT":
            return update_product(req)
        elif method == "DELETE":
            return delete_product(req)
        else:
            return func.HttpResponse("Method not allowed", status_code=405)
    except Exception as e:
        logging.error(str(e))
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)


# --- CRUD functions ---

def create_product(req):
    product = req.get_json()
    if "id" not in product or "Category" not in product:
        return func.HttpResponse("ID and Category are required!", status_code=400)
    try:
        container.create_item(body=product)
        return func.HttpResponse(f"Product {product['id']} created successfully!", status_code=201)
    except exceptions.CosmosResourceExistsError:
        return func.HttpResponse(f"Product {product['id']} already exists!", status_code=409)

def read_product(req):
    product_id = req.params.get('id')
    category = req.params.get('category')
    if not product_id or not category:
        return func.HttpResponse("ID and Category are required!", status_code=400)
    try:
        item = container.read_item(item=product_id, partition_key=category)
        return func.HttpResponse(json.dumps(item), mimetype="application/json")
    except exceptions.CosmosResourceNotFoundError:
        return func.HttpResponse("Product not found", status_code=404)

def update_product(req):
    product = req.get_json()
    if "id" not in product or "Category" not in product:
        return func.HttpResponse("ID and Category are required!", status_code=400)
    container.upsert_item(product)
    return func.HttpResponse(f"Product {product['id']} updated successfully!")

def delete_product(req):
    product_id = req.params.get('id')
    category = req.params.get('category')
    if not product_id or not category:
        return func.HttpResponse("ID and Category are required!", status_code=400)
    try:
        container.delete_item(item=product_id, partition_key=category)
        return func.HttpResponse(f"Product {product_id} deleted successfully!")
    except exceptions.CosmosResourceNotFoundError:
        return func.HttpResponse("Product not found", status_code=404)

