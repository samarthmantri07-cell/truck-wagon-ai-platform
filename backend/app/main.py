from fastapi import FastAPI

app = FastAPI(title='Truck & Wagon AI API')

@app.get('/health')
def health_check():
    return {'status': 'ok'}
