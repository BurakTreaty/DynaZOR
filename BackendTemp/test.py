from scheduler import User
from db import createTables

createTables()
user1 = User("sususamungus")
user1.scheduleGeneration()
user1.showSchedule()
freeList = [("2025-12-04", "10:15"),("2025-12-03", "10:15"),("2025-12-03", "16:15")]
for slot in freeList:
    user1.reSchedulerAlgorithm(slot[0], slot[1])

user1.showSchedule()
