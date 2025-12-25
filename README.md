DynaZOR

fronted of DynaZOR
This repository contains the frontend implementation of the DynaZOR Scheduling System in the frontend folder of the repository, developed as part of the CNG 495 Capstone Project (Fall 2025).
The frontend is built using Vite, React, Tailwind CSS, and communicates with the backend through Axios based API functions.

The primary features currently implemented include:
Home page:
<img width="2399" height="1342" alt="image" src="https://github.com/user-attachments/assets/18519ea0-a5be-46fe-b90c-971cd6c924a3" />

User Login

<img width="2389" height="1323" alt="image" src="https://github.com/user-attachments/assets/b8453641-75e4-4d02-9d68-34e394651b84" />

The login component has the necessary error handling such as required fields.

-> User can route to register page if they click the Register link.

<img width="312" height="68" alt="image" src="https://github.com/user-attachments/assets/2178db40-6a03-4299-8d95-c7f02fb5c7e3" />

User Registration

<img width="2388" height="1323" alt="image" src="https://github.com/user-attachments/assets/50a7218e-1452-497e-9b31-d2be4e1f4246" />

The register component has the necessary error handling such as required fields, the backend gives a 409 error if user already exists.

-> User can route to login page if they click the Login link.

<img width="319" height="66" alt="image" src="https://github.com/user-attachments/assets/61134462-03bf-49fe-9af0-4430df4843bc" />

Daily Schedule view with clickable schedule cells:

<img width="2367" height="1341" alt="image" src="https://github.com/user-attachments/assets/18ce071b-ade8-4eca-aa67-ad24875a8754" />

User can toggle the availabilty of the slots by clicking the cells. 

Making an appointment:

<img width="1996" height="166" alt="image" src="https://github.com/user-attachments/assets/5d97aa43-fe1d-4268-b838-8a4ee0d5c8de" />

When this button is cliked the user is asked the username of the user they wish to get an appointment from. This component also has the necessary error handling such as making sure the username exists. 

<img width="1928" height="306" alt="image" src="https://github.com/user-attachments/assets/92873d6d-9060-478c-bc36-7536ebf2aad2" />

<img width="2355" height="1323" alt="image" src="https://github.com/user-attachments/assets/f36d6216-1847-42ff-a298-5e08f0c0ca82" />

When the user submits the username theyre routed to the schedule of the user they wished to take the appointment from. They can select and submit at most 3 available timeslots for the backend algorithm to calculate and give response with the best booking time.

<img width="2276" height="1304" alt="image" src="https://github.com/user-attachments/assets/1dabbd60-b255-4f1f-9250-5599ee97761d" />

Backend of the DynaZOR
This repository contains the backend implementation of the DynaZOR Scheduling System in the DynaZOR (backend and frontend merged for testing) and BackendTemp (for future backend operations) folders of the repository, developed as part of the CNG 495 Capstone Project (Fall 2025).

The backend is built using Python and Flask micro framework, on Visual Studio.
Its main purpose is to maintain the data in the Microsoft SQL Server cloud database that is on the Amazon RDS cloud service, recieve and process the request of the frontend (such as login info, or registeration process) and basically handle the communication between the frontend and the cloud database without any problems.

Appointment Algorithm Explanation
When a viewer submits up to 3 available timeslot selections on an owner's schedule, the system processes each selection through the schedulerAlgorithm: it first checks if the slot is free (available=1 and not already booked); if free, it books the appointment by calling addAppointmentDB(), which sets the slot as booked on the owner's schedule with bookedByUserID=viewerID and mirrors the booking on the viewer's schedule with available=0 and bookedByUserID=ownerID, then updates appointment statistics for analytics. If the slot is already booked or the viewer is already in the waitlist, the request is rejected with an appropriate error. If the slot is booked but the viewer is not yet queued, they are added to the priorityQueue with a priority number based on queue position. When the owner later cancels the appointment or toggles the slot free, reSchedulerAlgorithm() is triggered, which iterates through the waitlist in priority order, checks each queued user's availability, and automatically promotes the first eligible user by booking them, removing them from the queue, and sending them a notification email that ensures the next person in line gets the appointment without manual intervention.


