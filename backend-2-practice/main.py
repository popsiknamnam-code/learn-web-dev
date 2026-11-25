from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Barbershop API")

# ==========================================
# ИМИТАЦИЯ БАЗЫ ДАННЫХ (для теста)
# ==========================================
class Category(BaseModel):
    id: int
    name: str

class Service(BaseModel):
    id: int
    category_id: int
    name: str

# Список категорий
categories_db = [
    Category(id=1, name="Стрижки и укладки"),
    Category(id=2, name="Маникюр и педикюр"),
    Category(id=3, name="Брови и ресницы"),
    Category(id=4, name="Спа-процедуры"),
]

# Список услуг (привязаны к категориям через category_id)
services_db = [
    Service(id=1, category_id=1, name="Мужская стрижка"),
    Service(id=2, category_id=1, name="Женская стрижка"),
    Service(id=3, category_id=1, name="Укладка"),
    Service(id=4, category_id=1, name="Бритье"),
    Service(id=5, category_id=1, name="Детская стрижка"),
    
    Service(id=6, category_id=2, name="Маникюр"),
    Service(id=7, category_id=2, name="Педикюр"),
    Service(id=8, category_id=2, name="Наращивание ногтей"),
    Service(id=9, category_id=2, name="Дизайн"),
    Service(id=10, category_id=2, name="Снятие покрытия"),

    Service(id=11, category_id=3, name="Коррекция бровей"),
    Service(id=12, category_id=3, name="Окрашивание бровей"),
    Service(id=13, category_id=3, name="Наращивание ресниц"),
    Service(id=14, category_id=3, name="Ламинирование"),

    Service(id=15, category_id=4, name="Массаж лица"),
    Service(id=16, category_id=4, name="Пилинг"),
    Service(id=17, category_id=4, name="Обертывание"),
    Service(id=18, category_id=4, name="Чистка лица"),
]

# ==========================================
# ЗАДАНИЕ 1. Список категорий
# GET /categories
# ==========================================
@app.get("/categories")
def get_categories():
    result = []
    for category in categories_db:
        # Считаем количество услуг в этой категории
        count = sum(1 for service in services_db if service.category_id == category.id)
        
        result.append({
            "id": category.id,
            "name": category.name,
            "servicesCount": count
        })
    return result

# ==========================================
# ЗАДАНИЕ 2. Информация по категории
# GET /categories/{category_id}
# ==========================================
@app.get("/categories/{category_id}")
def get_category(category_id: int):
    # Ищем категорию по ID
    category = next((c for c in categories_db if c.id == category_id), None)
    
    # Если не нашли — возвращаем 404 (Not Found)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
        
    # Считаем количество услуг
    count = sum(1 for service in services_db if service.category_id == category.id)
    
    return {
        "id": category.id,
        "name": category.name,
        "servicesCount": count
    }