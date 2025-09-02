import logging
import azure.functions as func
import json
import os
from azure.cosmos import CosmosClient, PartitionKey, exceptions

# Cosmos DB config from Azure Function App settings
URL = os.environ["COSMOS_URL"]
KEY = os.environ["COSMOS_KEY"]
DATABASE_NAME = os.environ["DATABASE_NAME"]
CONTAINER_NAME = os.environ["CONTAINER_NAME"]

client = CosmosClient(URL, credential=KEY)
database = client.create_database_if_not_exists(id=DATABASE_NAME)
container = database.create_container_if_not_exists(
    id=CONTAINER_NAME,
    partition_key=PartitionKey(path="/Category"),
    offer_throughput=400
)

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        action = req.params.get('action')
        if not action:
            try:
                req_body = req.get_json()
            except ValueError:
                return func.HttpResponse("Please pass an action in query string or request body", status_code=400)
            else:
                action = req_body.get('action')

        if action == "create":
            return create_product(req)
        elif action == "read":
            return read_product(req)
        elif action == "update":
            return update_product(req)
        elif action == "delete":
            return delete_product(req)
        else:
            return func.HttpResponse("Invalid action", status_code=400)

    except Exception as e:
        logging.error(str(e))
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)

# --- CRUD Operations ---
def create_product(req):
    product = req.get_json()
    container.create_item(body=product)
    return func.HttpResponse(f"Product {product['id']} created successfully!", status_code=201)

def read_product(req):
    product_id = req.params.get('id')
    category = req.params.get('category')
    if not product_id or not category:
        return func.HttpResponse("Please provide id and category", status_code=400)
    try:
        item = container.read_item(item=product_id, partition_key=category)
        return func.HttpResponse(json.dumps(item), mimetype="application/json")
    except exceptions.CosmosResourceNotFoundError:
        return func.HttpResponse("Product not found", status_code=404)

def update_product(req):
    product = req.get_json()
    product_id = product.get('id')
    category = product.get('Category')
    if not product_id or not category:
        return func.HttpResponse("Please provide id and Category", status_code=400)
    container.upsert_item(product)
    return func.HttpResponse(f"Product {product_id} updated successfully!")

def delete_product(req):
    product_id = req.params.get('id')
    category = req.params.get('category')
    if not product_id or not category:
        return func.HttpResponse("Please provide id and category", status_code=400)
    try:
        container.delete_item(item=product_id, partition_key=category)
        return func.HttpResponse(f"Product {product_id} deleted successfully!")
    except exceptions.CosmosResourceNotFoundError:
        return func.HttpResponse("Product not found", status_code=404)
