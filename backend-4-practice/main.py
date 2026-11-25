from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel, Field, ConfigDict

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

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, index=True)
    title = Column(String, index=True)
    desc = Column(String, nullable=True)
    duration = Column(Integer)
    price = Column(Float)

# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

class MasterResponse(BaseModel):
    id: int
    name: str
    specialization: str

    model_config = ConfigDict(from_attributes=True)

class ServiceCreate(BaseModel):
    categoryId: int = Field(..., description="ID категории")
    title: str = Field(..., min_length=1, max_length=100, description="Название услуги")
    desc: str = Field(..., min_length=1, max_length=100, description="Описание услуги")
    duration: int = Field(..., ge=30, le=180, description="Продолжительность (30-180 минут)")
    price: float = Field(..., gt=0, description="Стоимость (больше 0)")

class ServiceResponse(BaseModel):
    id: int
    category_id: int
    title: str
    desc: str | None
    duration: int
    price: float

    model_config = ConfigDict(from_attributes=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="Barbershop API")

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

@app.post("/services", status_code=201, response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    # Создаем объект для БД
    new_service = Service(
        category_id=service.categoryId,  # Переводим categoryId в category_id
        title=service.title,
        desc=service.desc,
        duration=service.duration,
        price=service.price
    )
    
    # Сохраняем в БД
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    
    return new_service

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