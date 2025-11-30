# db.py
from dotenv import load_dotenv
import sqlite3
import pyodbc
import os
from datetime import date

load_dotenv()
conn = pyodbc.connect(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={os.getenv('SQLSERVER_HOST')};"
        f"DATABASE={os.getenv('SQLSERVER_DB')};"
        f"UID={os.getenv('SQLSERVER_USER')};"
        f"PWD={os.getenv('SQLSERVER_PASS')}",
)
#conn = sqlite3.connect("local_test.db")
cursor = conn.cursor()


def createTables():
    cursor.execute("DROP TABLE IF EXISTS timeslots")
    cursor.execute("DROP TABLE IF EXISTS userSchedule")
    cursor.execute("DROP TABLE IF EXISTS users")

    cursor.execute("""
    CREATE TABLE users (
        userID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    );
    """)

    cursor.execute("""
    CREATE TABLE userSchedule (
        scheduleID INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER,
        scheduleDate DATE,
        FOREIGN KEY (userID) REFERENCES users(userID)
    );
    """)

    cursor.execute("""
    CREATE TABLE timeslots (
        timeSlotID INTEGER PRIMARY KEY AUTOINCREMENT,
        scheduleID INTEGER,
        hour INTEGER,
        minute INTEGER,
        available INTEGER,
        FOREIGN KEY (scheduleID) REFERENCES userSchedule(scheduleID)
    );
    """)
    conn.commit()


def getUserID(name):
    cursor.execute("SELECT userID FROM users WHERE name=?", (name,))
    row = cursor.fetchone()
    return row[0] if row else None


def createUser(name):
    cursor.execute("INSERT INTO users(name) VALUES(?)", (name,))
    conn.commit()
    return cursor.lastrowid


def deletePastDays(userID, today: date):
    cursor.execute("""
        DELETE FROM userSchedule WHERE userID=? AND scheduleDate < ?
    """, (userID, today))
    conn.commit()


def getLastScheduleDay(userID):
    cursor.execute("""
        SELECT scheduleDate FROM userSchedule
        WHERE userID=?
        ORDER BY scheduleDate DESC
        LIMIT 1
    """, (userID,))
    row = cursor.fetchone()
    return row[0] if row else None


def getScheduleDayCount(userID):
    cursor.execute("""
        SELECT COUNT(*) FROM userSchedule WHERE userID=?
    """, (userID,))
    return cursor.fetchone()[0]


def insertScheduleDay(userID, scheduleDate):
    cursor.execute("""
        INSERT INTO userSchedule(userID, scheduleDate)
        VALUES (?, ?)
    """, (userID, scheduleDate))
    conn.commit()
    return cursor.lastrowid



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

def freeSlotDB(userID, date, hour, minute):
    cursor.execute("""
        UPDATE timeslots
        SET available = 1
        WHERE hour = ?
          AND minute = ?
          AND scheduleID = (
                SELECT scheduleID
                FROM userSchedule
                WHERE userID = ?
                  AND scheduledate = ?
          )
    """, (hour, minute, userID, date))

    conn.commit()
    return cursor.rowcount


