from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tasks import execute_pipeline_task

app = FastAPI()

origins = [
    "http://localhost:5173",  # Frontend development server
    "http://127.0.0.1:5173",  # Another common local development address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run-pipeline")
async def run_pipeline(pipeline: dict):
    # This sends the work to Celery and returns immediately
    task = execute_pipeline_task.delay(pipeline)
    return {"task_id": task.id, "message": "Pipeline execution started in background"}

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    from celery.result import AsyncResult
    res = AsyncResult(task_id)
    return {"status": res.status, "result": res.result}