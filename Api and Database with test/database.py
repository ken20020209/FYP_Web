from flask import g
import sqlite3
import uuid


DATABASE = 'database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def create_tables():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''CREATE TABLE IF NOT EXISTS User (
                    User_ID TEXT PRIMARY KEY,
                    name TEXT,
                    position TEXT,
                    password TEXT
                    )''')

    # 添加示例用户到数据库中...
    cursor.execute('''CREATE TABLE IF NOT EXISTS Dog (
                    dogID INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    detail TEXT
                    )''')
    
    cursor.execute('''
                    CREATE TABLE IF NOT EXISTS Video (
                        videoID TEXT PRIMARY KEY,  
                        dogID INTEGER NOT NULL,
                        datetime TEXT NOT NULL,
                        videoSrc TEXT NOT NULL,
                        FOREIGN KEY (dogID) REFERENCES Dog (dogID)
                    )
                    ''')
    
    cursor.execute('''
                        CREATE TABLE Map (
                            mapID TEXT PRIMARY KEY,
                            dogID INTEGER NOT NULL,
                            datetime TEXT NOT NULL,
                            mapSrc TEXT NOT NULL,
                            FOREIGN KEY (dogID) REFERENCES Dog (dogID)
                        )
                    ''')
    
    conn.commit()  

def generate_user_id():
    cursor = get_db().cursor()
    cursor.execute("SELECT COUNT(*) FROM User")
    count = cursor.fetchone()[0]
    user_id = 'U' + str(count + 1).zfill(3)
    return user_id


