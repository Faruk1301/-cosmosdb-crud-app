import os
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Serve requested file, default to index.html
        path = req.route_params.get('file', 'index.html')
        file_path = os.path.join(os.path.dirname(__file__), path)

        # Determine mimetype
        if file_path.endswith('.html'):
            mimetype = 'text/html'
        elif file_path.endswith('.js'):
            mimetype = 'application/javascript'
        elif file_path.endswith('.css'):
            mimetype = 'text/css'
        else:
            mimetype = 'text/plain'

        # Read file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return func.HttpResponse(content, mimetype=mimetype)

    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
