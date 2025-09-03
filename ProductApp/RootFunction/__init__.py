import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    # Redirect root URL to FrontendFunction
    return func.HttpResponse(
        status_code=302,  # temporary redirect
        headers={"Location": "/api/FrontendFunction"}
    )
