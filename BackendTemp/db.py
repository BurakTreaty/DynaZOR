# db.py
from dotenv import load_dotenv
import sqlite3
import pyodbc
import os
from datetime import date

load_dotenv()
# conn = pyodbc.connect(
#         f"DRIVER={{ODBC Driver 17 for SQL Server}};"
#         f"SERVER={os.getenv('SQLSERVER_HOST')};"
#         f"DATABASE={os.getenv('SQLSERVER_DB')};"
#         f"UID={os.getenv('SQLSERVER_USER')};"
#         f"PWD={os.getenv('SQLSERVER_PASS')}",
# )
conn = sqlite3.connect("local_test.db")
cursor = conn.cursor()


def createTables():
    cursor.execute("IF OBJECT_ID('priorityQueue','U') IS NOT NULL DROP TABLE priorityQueue;")
    cursor.execute("IF OBJECT_ID('timeslots','U') IS NOT NULL DROP TABLE timeslots;")
    cursor.execute("IF OBJECT_ID('userSchedule','U') IS NOT NULL DROP TABLE userSchedule;")
    cursor.execute("IF OBJECT_ID('users','U') IS NOT NULL DROP TABLE users;")

    cursor.execute("""
    CREATE TABLE users (
        userID INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        username NVARCHAR(255) UNIQUE NOT NULL,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE userSchedule (
        scheduleID INT IDENTITY(1,1) PRIMARY KEY,
        userID INT NOT NULL FOREIGN KEY REFERENCES users(userID),
        scheduleDate DATE NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE timeslots (
        timeSlotID INT IDENTITY(1,1) PRIMARY KEY,
        scheduleID INT NOT NULL FOREIGN KEY REFERENCES userSchedule(scheduleID),
        bookedByUserID INT FOREIGN KEY REFERENCES users(userID), 
        hour INT CHECK (hour BETWEEN 0 AND 23),   
        minute INT CHECK (minute BETWEEN 0 AND 59), 
        available BIT DEFAULT 1 
    );
    """)

    cursor.execute("""
    CREATE TABLE priorityQueue (
        timeSlotID INT NOT NULL,
        userID INT NOT NULL,
        priorityNo INT NOT NULL, 
        PRIMARY KEY (timeSlotID, userID), -- Composite Key: A user cannot queue for the same slot twice
        FOREIGN KEY (timeSlotID) REFERENCES timeslots(timeSlotID),
        FOREIGN KEY (userID) REFERENCES users(userID)
    );
    """)
    

    conn.commit()


def getUserID(username):
    cursor.execute("SELECT userID FROM users WHERE username=?", (username,))
    row = cursor.fetchone()
    return row[0] if row else None


def checkUserLogin(email,password):
    cursor.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
    row = cursor.fetchone()
    return row

def checkUserExist(username,email):
    cursor.execute("SELECT * FROM users WHERE username=? OR email=?", (username, email))
    row = cursor.fetchone()
    return row


def createUser(name,username,email,password):
    cursor.execute("INSERT INTO users(name,username,email,password) VALUES(?,?,?,?)", (name,username,email,password))
    conn.commit()


def deletePastDays(userID, today: date):
    cursor.execute("""
        DELETE FROM timeslots 
        WHERE scheduleID IN (
            SELECT scheduleID FROM userSchedule 
            WHERE userID=? AND scheduleDate < ?
        )
    """, (userID, today))
    cursor.execute("""
        DELETE FROM userSchedule WHERE userID=? AND scheduleDate < ?
    """, (userID, today))
    conn.commit()


def getLastScheduleDay(userID):
    cursor.execute("""
        SELECT TOP 1 scheduleDate FROM userSchedule
        WHERE userID=?
        ORDER BY scheduleDate DESC
    """, (userID,))
    row = cursor.fetchone()
    return row[0] if row else None


def getScheduleDayCount(userID):
    cursor.execute("""
        SELECT COUNT(*) FROM userSchedule WHERE userID=?
    """, (userID,))
    count = cursor.fetchone()[0]
    return count


def insertScheduleDay(userID, scheduleDate):
    cursor.execute("""
        INSERT INTO userSchedule(userID, scheduleDate)
        OUTPUT INSERTED.scheduleID 
        VALUES (?, ?)
    """, (userID, scheduleDate))
    row = cursor.fetchone()
    schedule_id = row[0] if row else None
    conn.commit()
    return schedule_id


def insertTimeSlot(scheduleID, hour, minute, available):
    cursor.execute("""
        INSERT INTO timeslots(scheduleID, hour, minute, available)
        VALUES (?, ?, ?, ?)
    """, (scheduleID, hour, minute, available))
    conn.commit()

def getSchedule(userID):
    cursor.execute("""
        SELECT scheduleID, scheduleDate FROM userSchedule
        WHERE userID=?
        ORDER BY scheduleDate
    """, (userID,))
    days = cursor.fetchall()

    schedule = []

    for scheduleID, scheduleDate in days:
        cursor.execute("""
            SELECT hour, minute, available FROM timeslots
            WHERE scheduleID=? ORDER BY hour, minute
        """, (scheduleID,))
        timeSlots = cursor.fetchall()
        schedule.append((scheduleDate, timeSlots))

    return schedule
def getTimeslotID(user_id, date_str, hour, minute):
    cursor.execute("""
        SELECT ts.timeSlotID 
        FROM timeslots ts
        JOIN userSchedule us ON ts.scheduleID = us.scheduleID
        WHERE us.userID = ? 
          AND us.scheduleDate = ? 
          AND ts.hour = ? 
          AND ts.minute = ?
    """, (user_id, date_str, hour, minute))
    row = cursor.fetchone()
    return row[0]
def getWaitList(timeslot_id):
    cursor.execute("""
        SELECT 
            pq.priorityNo,
            u.userID,
            u.name,
            u.email
        FROM priorityQueue pq
        JOIN users u ON pq.userID = u.userID
        WHERE pq.timeSlotID = ?
        ORDER BY pq.priorityNo ASC
    """, (timeslot_id,))

    results = []
    for row in cursor.fetchall():
        results.append({
            "priority": row[0],
            "user_id": row[1],
            "name": row[2],
            "email": row[3]
        })
    return results

def addWaitList(timeslot_id, user_id):
    cursor.execute("""
        SELECT MAX(priorityNo) FROM priorityQueue WHERE timeSlotID = ?
    """, (timeslot_id,))
    row = cursor.fetchone()
    current_max = row[0] if row[0] is not None else 0
    new_priority = current_max + 1

    cursor.execute("""
        INSERT INTO priorityQueue (timeSlotID, userID, priorityNo)
        VALUES (?, ?, ?)
    """, (timeslot_id, user_id, new_priority))
    conn.commit()


def freeSlotDB(timeSlotID):
    cursor.execute("""
        UPDATE timeslots
        SET available = 1, bookedByUserID = NULL
        WHERE timeSlotID = ?
    """, (timeSlotID,))
    conn.commit()
    return cursor.rowcount

def addAppointmentDB(timeslotID, userID):
    cursor.execute("""
        UPDATE timeslots 
        SET available = 0, bookedByUserID = ?
        WHERE timeSlotID = ?
    """, (userID, timeslotID))
    conn.commit()

def removeFromWaitlist(timeslot_id, user_id):
    cursor.execute("""
        DELETE FROM priorityQueue 
        WHERE timeSlotID = ? AND userID = ?
    """, (timeslot_id, user_id))
    conn.commit()

def isBooked(timeslotID):
    cursor.execute("""
        SELECT available 
        FROM timeslots 
        WHERE timeSlotID = ?
    """, (timeslotID,))
    row = cursor.fetchone()
    return row[0] == 0 




