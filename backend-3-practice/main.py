from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Master(Base):
    __tablename__ = "masters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialization = Column(String, index=True)
Base.metadata.create_all(bind=engine)

class MasterResponse(BaseModel):
    id: int
    name: str
    specialization: str

    class Config:
        from_attributes = True 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="Barbershop API - Masters")

@app.get("/masters", response_model=list[MasterResponse])
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Master)
    if specialization:
        query = query.filter(Master.specialization == specialization)
    return query.all()
@app.get("/masters/{master_id}", response_model=MasterResponse)
def get_master(master_id: int, db: Session = Depends(get_db)):
    master = db.query(Master).filter(Master.id == master_id).first()
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    if db.query(Master).count() == 0:
        masters = [
            Master(name="Анна", specialization="Парикмахер"),
            Master(name="Мария", specialization="Визажист"),
            Master(name="Елена", specialization="Парикмахер")
        ]
        db.add_all(masters)
        db.commit()
    db.close()