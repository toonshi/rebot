from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from tasks import execute_pipeline_task, db

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

class PipelineSchema(BaseModel):
    name: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

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

@app.post("/pipelines")
async def save_pipeline(pipeline: PipelineSchema):
    # This stores your nodes and varNames exactly as they are on the canvas
    pipeline_data = pipeline.dict()
    pipeline_data["saved_at"] = datetime.utcnow().isoformat()
    result = await db.pipelines.insert_one(pipeline_data)
    return {
        "id": str(result.inserted_id),
        "status": "Pipeline saved!",
        "saved_at": pipeline_data["saved_at"]
    }

@app.get("/pipelines")
async def get_pipelines():
    # Helper to see all your saved NGO or student projects
    cursor = db.pipelines.find()
    pipelines = await cursor.to_list(length=100)
    for p in pipelines:
        p["_id"] = str(p["_id"])  # Convert ObjectId for JSON compatibility
    return pipelines