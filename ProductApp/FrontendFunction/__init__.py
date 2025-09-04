import os
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Default to index.html
        file_name = req.route_params.get('file', 'index.html')
        file_path = os.path.join(os.path.dirname(__file__), file_name)

        if not os.path.exists(file_path):
            return func.HttpResponse("File not found", status_code=404)

        # Detect mime type
        if file_name.endswith(".html"):
            mimetype = "text/html"
        elif file_name.endswith(".js"):
            mimetype = "application/javascript"
        elif file_name.endswith(".css"):
            mimetype = "text/css"
        else:
            mimetype = "text/plain"

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        return func.HttpResponse(content, mimetype=mimetype)

    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)

