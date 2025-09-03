import os
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        html_path = os.path.join(os.path.dirname(__file__), 'index.html')
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        return func.HttpResponse(html_content, mimetype="text/html")
    except Exception as e:
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
