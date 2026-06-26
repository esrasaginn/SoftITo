import json
import random

def generate_database():
    first_names = ["Ahmet", "Mehmet", "Ali", "Veli", "Can", "Zeynep", "Ayşe", "Fatma", "Seda", "Elif", 
                   "Buse", "Canan", "Mustafa", "Murat", "Hakan", "Yakup", "Selahaddin", "Cem", "Deniz", 
                   "Selim", "Selin", "Gizem", "Emre", "Oğuz", "Burak", "Berna", "Kerem", "Merve", "Aslı"]
    last_names = ["Yılmaz", "Kaya", "Demir", "Çeliker", "Aksoy", "Öztürk", "Koç", "Şahin", "Aydın", 
                  "Yıldız", "Erdem", "Arslan", "Polat", "Acar", "Şimşek", "Güler", "Yurt", "Kurt", "Yalçın"]
    
    companies = ["Mühendislik A.Ş.", "Mimarlık Ltd.", "İnşaat Ticaret", "Teknoloji A.Ş.", 
                 "Yazılım Hizmetleri", "Lojistik Ticaret", "Gıda Sanayi", "Bilişim Sistemleri"]

    categories = ["Bilgisayar", "Telefon", "Aksesuar", "Yazıcı", "Yazılım Lisansları"]
    
    # 1. Generate Customers (1000 records)
    customers = []
    for i in range(1, 1001):
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        company = f"{random.choice(last_names)} {random.choice(companies)}" if random.random() > 0.15 else "Bireysel Müşteri"
        email = f"{name.lower().replace(' ', '.').replace('ş', 's').replace('ç', 'c').replace('ğ', 'g').replace('ı', 'i').replace('ü', 'u').replace('ö', 'o')}@mail.com"
        phone = f"+90 532 {random.randint(100, 999)} {random.randint(1000, 9999)}"
        balance = random.randint(-15000, 50000)
        status = "Aktif" if balance >= 0 else "Riskli"
        if balance == 0:
            status = "Pasif"
        
        customers.append({
            "id": i,
            "name": name,
            "company": company,
            "email": email,
            "phone": phone,
            "balance": balance,
            "status": status
        })

    # 2. Generate Products (1000 records)
    products = []
    sku_set = set()
    
    product_base = {
        "Bilgisayar": ["Macbook Pro 14\"", "Macbook Air 13\"", "Dell XPS 15", "Lenovo ThinkPad X1", "Asus Zenbook 14", "HP Spectre x360"],
        "Telefon": ["iPhone 15 Pro", "Samsung Galaxy S24", "Xiaomi 14 Ultra", "iPhone 15 128GB", "Google Pixel 8", "OnePlus 12"],
        "Aksesuar": ["Logitech MX Master 3S", "Apple Magic Keyboard", "Dell 24\" Monitör", "AirPods Pro", "Anker Powerbank 20k", "Samsun SSD T7"],
        "Yazıcı": ["HP LaserJet Pro", "Canon Pixma G3010", "Epson L3250", "Brother HL-L2350DW"],
        "Yazılım Lisansları": ["Windows 11 Pro Retail", "Office 365 Pro Yıllık", "Adobe Creative Cloud", "JetBrains All Products Pack"]
    }

    icons = {
        "Bilgisayar": "desktop",
        "Telefon": "phone",
        "Aksesuar": "mouse",
        "Yazıcı": "box",
        "Yazılım Lisansları": "box"
    }

    for i in range(1, 1001):
        cat = random.choice(categories)
        base_name = random.choice(product_base[cat])
        sku_num = random.randint(100, 999)
        sku = f"SKU-{sku_num}-{cat[:3].upper()}"
        while sku in sku_set:
            sku_num = random.randint(100, 999)
            sku = f"SKU-{sku_num}-{cat[:3].upper()}"
        sku_set.add(sku)

        price = random.randint(1000, 95000)
        description = f"{base_name} model, yüksek kaliteli {cat.lower()} ürünü."
        
        products.append({
            "id": i,
            "name": f"{base_name} V{random.randint(1, 5)}",
            "sku": sku,
            "category": cat,
            "price": price,
            "description": description,
            "iconType": icons[cat]
        })

    # 3. Generate Stock Items (1000 records)
    stock = []
    locations = ["Depo-A • Raf B3", "Depo-A • Raf C1", "Depo-B • Raf A2", "Depo-A • Raf B10", "Depo-B • Raf D4", "Depo-A • Raf E2"]
    for i, p in enumerate(products):
        qty = random.randint(0, 120)
        status = "Stokta Var"
        if qty == 0:
            status = "Tükendi"
        elif qty <= 10:
            status = "Kritik Sınır"
            
        stock.append({
            "id": p["id"],
            "sku": p["sku"],
            "name": p["name"],
            "category": p["category"],
            "quantity": qty,
            "location": random.choice(locations),
            "status": status
        })

    # 4. Contacts & Chat Messages
    contacts = [
        { "id": "AY", "name": "Ahmet Yılmaz", "role": "Admin", "active": True, "initials": "AY", "bgClass": "avatar-indigo" },
        { "id": "MH", "name": "Muhasebe Grubu", "role": "Muhasebe", "active": True, "initials": "MH", "bgClass": "avatar-slate" },
        { "id": "TD", "name": "Teknik Destek (Can)", "role": "Teknik", "active": False, "initials": "TD", "bgClass": "avatar-orange" },
        { "id": "SD", "name": "Seda Demir (Satış)", "role": "Satış", "active": False, "initials": "SD", "bgClass": "avatar-blue" },
        { "id": "HE", "name": "Hakan Erdem", "role": "Yazılım Geliştirici", "active": True, "initials": "HE", "bgClass": "avatar-indigo" },
        { "id": "GK", "name": "Gizem Kaya", "role": "İnsan Kaynakları", "active": True, "initials": "GK", "bgClass": "avatar-slate" },
        { "id": "CK", "name": "Canan Koç", "role": "Pazarlama Uzmanı", "active": False, "initials": "CK", "bgClass": "avatar-orange" },
        { "id": "CA", "name": "Cem Aksoy", "role": "Finans Müdürü", "active": False, "initials": "CA", "bgClass": "avatar-blue" },
        { "id": "EY", "name": "Elif Yalçın", "role": "Müşteri İlişkileri", "active": True, "initials": "EY", "bgClass": "avatar-indigo" },
        { "id": "MC", "name": "Murat Çelik", "role": "Lojistik Sorumlusu", "active": False, "initials": "MC", "bgClass": "avatar-slate" },
        { "id": "BD", "name": "Buse Demir", "role": "Satın Alma", "active": True, "initials": "BD", "bgClass": "avatar-orange" },
        { "id": "YY", "name": "Yakup Yurt", "role": "Depo Sorumlusu", "active": False, "initials": "YY", "bgClass": "avatar-blue" },
        { "id": "BA", "name": "Berna Aydın", "role": "Sistem Yöneticisi", "active": True, "initials": "BA", "bgClass": "avatar-indigo" },
        { "id": "KS", "name": "Kerem Şahin", "role": "Grafiker", "active": False, "initials": "KS", "bgClass": "avatar-slate" },
        { "id": "MP", "name": "Merve Polat", "role": "Satış Temsilcisi", "active": True, "initials": "MP", "bgClass": "avatar-orange" },
        { "id": "AS", "name": "Aslı Şimşek", "role": "Proje Yöneticisi", "active": False, "initials": "AS", "bgClass": "avatar-blue" },
        { "id": "SA", "name": "Selim Arslan", "role": "Veritabanı Yöneticisi", "active": True, "initials": "SA", "bgClass": "avatar-indigo" },
        { "id": "SG", "name": "Selin Güler", "role": "Muhasebe Uzmanı", "active": True, "initials": "SG", "bgClass": "avatar-slate" },
        { "id": "EA", "name": "IT Destek (Emre)", "role": "IT Destek", "active": False, "initials": "EA", "bgClass": "avatar-orange" },
        { "id": "OK", "name": "Oğuz Kurt", "role": "Güvenlik Uzmanı", "active": False, "initials": "OK", "bgClass": "avatar-blue" },
        { "id": "BY", "name": "Burak Yıldız", "role": "Satış Temsilcisi", "active": True, "initials": "BY", "bgClass": "avatar-indigo" },
        { "id": "DK", "name": "Deniz Koç", "role": "Tasarımcı", "active": True, "initials": "DK", "bgClass": "avatar-slate" },
        { "id": "VD", "name": "Veli Demir", "role": "Depo Elemanı", "active": False, "initials": "VD", "bgClass": "avatar-orange" },
        { "id": "CY", "name": "Canan Yıldız", "role": "IK Uzmanı", "active": False, "initials": "CY", "bgClass": "avatar-blue" },
        { "id": "HC", "name": "Hakan Çeliker", "role": "Pazarlama Yöneticisi", "active": True, "initials": "HC", "bgClass": "avatar-indigo" },
        { "id": "MK", "name": "Merve Kaya", "role": "Destek Uzmanı", "active": True, "initials": "MK", "bgClass": "avatar-slate" }
    ]

    chat_templates = [
        "Selamlar, yeni sevkiyat hakkında bir sorum olacaktı.",
        "Muhasebe departmanı Haziran ayı faturalarını sistemden kontrol etti mi?",
        "Macbook siparişi teslim edildi, stoklar güncellendi.",
        "Ödeme planı hakkında yeni sözleşmeyi sisteme ekliyorum.",
        "Yeni siparişler için teklif taslağı hazırlandı mı?",
        "Bakiye riskli olan müşteriler için takip başlattık.",
        "Merkez depodaki doluluk oranını kontrol edebilir misiniz?",
        "Destek talebi çözüldü, kapatabilirsiniz.",
        "Yeni yazılım lisansları sisteme işlendi.",
        "Satış ekibi yeni hedefleri belirledi, toplantı yarın saat 10:00'da."
    ]

    threads = {c["id"]: [] for c in contacts}
    for c in contacts:
        contact_id = c["id"]
        msg_count = 50
        for m_idx in range(1, msg_count + 1):
            sender = "me" if random.random() > 0.5 else contact_id
            content = f"{random.choice(chat_templates)} (Mesaj ID: {m_idx})"
            hour = random.randint(9, 18)
            minute = random.randint(10, 59)
            time_str = f"{hour:02d}:{minute:02d}"
            
            threads[contact_id].append({
                "id": m_idx,
                "sender": sender,
                "content": content,
                "time": time_str
            })

    db = {
        "customers": customers,
        "products": products,
        "stock": stock,
        "contacts": contacts,
        "threads": threads
    }

    # Write to public/db.json
    import os
    os.makedirs("public", exist_ok=True)
    with open("public/db.json", "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print("Database successfully generated with thousands of items!")

if __name__ == "__main__":
    generate_database()
