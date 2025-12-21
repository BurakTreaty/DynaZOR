import db
from scheduler import User
from datetime import datetime, timedelta
import pytz

stockholm_tz = pytz.timezone("Europe/Stockholm")
today = datetime.now(stockholm_tz).date()
tomorrow = today + timedelta(days=1)
TEST_DATE = tomorrow.strftime("%Y-%m-%d")

def run_full_system_test():
    print("\nStarting preparation for system diagnostics rituals\n")

    # 1. USER CREATION TEST
    print("Testing User Creation")
    doctor = User("Dr. Test", "dr_test", "dr@test.com", "securepass")
    patients = []
    for name in ["Alice", "Bob", "Charlie"]:
        username = name
        email = f"{name.lower()}@test.com"
        db.createUser(name, username, email, "12345")
        p_id = db.getUserID(username)
        patients.append({"name": name, "id": p_id})

    if not doctor.id or not all(p["id"] for p in patients):
        print("  User creation failed.")
        return
    print(" Users created successfully.\n")


    print("Testing Schedule Generation")
    doctor.scheduleGeneration()
    day_count = db.getScheduleDayCount(doctor.id)
    if day_count < 7:
        print(f"Schedule generation incomplete. Count: {day_count}")
        return
    target_hour, target_min = 10, 15 
    target_time_str = f"{target_hour}:{target_min}"
    ts_id = db.getTimeslotID(doctor.id, TEST_DATE, target_hour, target_min)
    
    if not ts_id:
        print(f"Specific timeslot {target_time_str} not found in DB.")
        return
    print("Schedule verified.\n")


    # 3. BOOKING LOGIC TEST
    
    # Alice (Patient 0) books the slot
    doctor.schedulerAlgorithm(TEST_DATE, target_time_str, patients[0]["id"])
    
    # Verify strictly in DB
    if db.isBooked(ts_id):
        print("Booking successful.\n")
    else:
        print("Slot should be booked, but DB says available.")
        return


    # 4. WAITLIST LOGIC TEST
    doctor.schedulerAlgorithm(TEST_DATE, target_time_str, patients[1]["id"])
    doctor.schedulerAlgorithm(TEST_DATE, target_time_str, patients[2]["id"])
    
    # Verify Waitlist Content
    wl = db.getWaitList(ts_id)
    print(f" Current Waitlist: {[u['name'] for u in wl]}")
    
    if len(wl) == 2 and wl[0]['name'] == "Bob" and wl[1]['name'] == "Charlie":
         print("Waitlist is correct (Size 2, Correct Order).\n")
    else:
         print(f"Waitlist mismatch. Expected Bob then Charlie. Got: {wl}")
         return

    # 5. CANCELLATION & PROMOTION TEST
    doctor.reSchedulerAlgorithm(TEST_DATE, target_time_str)
    # Check 1: Is slot still booked?
    if db.isBooked(ts_id):
        print("Slot status: BOOKED (Correct - Bob should have it).")
    else:
        print("Slot became free! Promotion logic failed.")
        return

    # Check 2: Verify Bob is gone from waitlist
    wl_after = db.getWaitList(ts_id)
    bob_still_waiting = any(u['name'] == "Bob" for u in wl_after)
    
    if not bob_still_waiting:
        print(" Promotion logic successful.\n")
    else:
        print("  Bob is still in the waitlist.")
        return

    print("All test passed. Praise be the Omnissiah")

if __name__ == "__main__":
    db.createTables()
    try:
        run_full_system_test()
    except Exception as e:
        print(f"\nERROR: {e}")