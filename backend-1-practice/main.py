class Master:
    def __init__(self, master_id):
        self.master_id = master_id

class Service:
    def __init__(self, service_id):
        self.service_id = service_id

def get_master(master_id):
    if master_id in [1, 2]:
        return Master(master_id)
    return None

def get_service(service_id):
    if service_id in [1, 2]:
        return Service(service_id)
    return None

appointments = []

class Appointment:
    def __init__(self, client_name: str, master_id: int, service_id: int, time: str):
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

    def is_valid(self) -> bool:
        """Проверяет, заполнены ли все поля (не пустые)"""
        if not self.client_name or not self.client_name.strip():
            return False
        if self.master_id is None or self.service_id is None or not self.time:
            return False
        return True


def create_appointment(client_name: str, master_id: int, service_id: int, time: str) -> Appointment | None:
    master = get_master(master_id)
    service = get_service(service_id)
    
    if master is None or service is None:
        return None
        
    
    appointment = Appointment(client_name, master.master_id, service.service_id, time)
    
    
    if not appointment.is_valid():
        return None
        

    try:
        hours, minutes = map(int, time.split(':'))
    except ValueError:
        return None 
        
    if hours < 8 or hours >= 20:
        return None 

   
    appointment.id = len(appointments) + 1 # Присваиваем ID
    appointments.append(appointment)
    return appointment


if __name__ == "__main__":
    print("--- Тест 1: Создание корректных записей ---")
    first_appointment = create_appointment("Иванова А.А.", 1, 1, '10:00')
    second_appointment = create_appointment("Петрова А.А.", 1, 1, '11:00')
    
    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)
        
    print("\n--- Тест 2: Попытка создать запись с пустым именем ---")
    # Сбрасываем список для чистоты теста
    appointments.clear() 
    no_correct_appointment = create_appointment("", 1, 1, '12:00')
    print("Количество записей после попытки (должно быть 0):", len(appointments))
    
    print("\n--- Тест 3: Попытка записаться в 00:00 ---")
    no_time_appointment = create_appointment("Сидорова А.А.", 1, 1, '00:00')
    print("Количество записей после попытки (должно быть 0):", len(appointments))