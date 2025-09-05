import os
import azure.functions as func
import mimetypes

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Get requested file from route parameter, default to index.html
        file_name = req.route_params.get('file') or 'index.html'
        file_path = os.path.join(os.path.dirname(__file__), file_name)

        if not os.path.exists(file_path) or os.path.isdir(file_path):
            return func.HttpResponse("File not found", status_code=404)

        # Automatically detect MIME type
        mimetype, _ = mimetypes.guess_type(file_path)
        if not mimetype:
            mimetype = "text/plain"

        # Read file content
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        return func.HttpResponse(content, mimetype=mimetype)

    except Exception as e:
        return func.HttpResponse(f"Internal Server Error: {str(e)}", status_code=500)


