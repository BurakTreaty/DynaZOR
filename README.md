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

<img width="2399" height="1335" alt="image" src="https://github.com/user-attachments/assets/3d05538c-ea32-4435-a11c-761a9e395c01" />

User can toggle the availabilty of the slots by clicking the cells. 

Making an appointment:

<img width="2376" height="780" alt="image" src="https://github.com/user-attachments/assets/046b44e9-3369-4652-9bd7-0dfb94b66a31" />

When this button is cliked the user is asked the username of the user they wish to get an appointment from. This component also has the necessary error handling such as making sure the username exists. 

<img width="1151" height="275" alt="image" src="https://github.com/user-attachments/assets/a17fe1ea-684a-4cd7-9d0a-591657da1051" />

<img width="2395" height="1340" alt="image" src="https://github.com/user-attachments/assets/b229459d-ed18-43de-8290-f80cc8833cba" />

When the user submits the username theyre routed to the schedule of the user they wished to take the appointment from. They can select and submit at most 3 available timeslots for the backend algorithm to calculate and give response with the best booking time.

<img width="2395" height="1346" alt="image" src="https://github.com/user-attachments/assets/18f09c29-ea84-42ad-9f78-e5b17edd4711" />

Backend of the DynaZOR
This repository contains the backend implementation of the DynaZOR Scheduling System in the DynaZOR (backend and frontend merged for testing) and BackendTemp (for future backend operations) folders of the repository, developed as part of the CNG 495 Capstone Project (Fall 2025).

The backend is built using Python and Flask micro framework, on Visual Studio.
Its main purpose is to maintain the data in the Microsoft SQL Server cloud database that is on the Amazon RDS cloud service, recieve and process the request of the frontend (such as login info, or registeration process) and basically handle the communication between the frontend and the cloud database without any problems.

More features will be added as the project progresses.
