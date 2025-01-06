// // const axios = require("axios");

// // const generateMeetLink = async (teacherId, consultationTime) => {
// //   const googleApiToken = process.env.GOOGLE_API_TOKEN;
// //   try {
// //     const response = await axios.post(
// //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// //       {
// //         summary: "Consultation Meeting",
// //         description: "Scheduled Consultation",
// //         start: {
// //           dateTime: new Date(consultationTime).toISOString(),
// //           timeZone: "UTC",
// //         },
// //         end: {
// //           dateTime: new Date(
// //             new Date(consultationTime).getTime() + 60 * 60 * 1000
// //           ).toISOString(),
// //           timeZone: "UTC",
// //         },
// //         conferenceData: {
// //           createRequest: {
// //             requestId: "21205000-jas-goodboy",
// //             conferenceSolutionKey: { type: "hangoutsMeet" },
// //           },
// //         },
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${googleApiToken}`,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );

// //     if (
// //       response.data.conferenceData &&
// //       response.data.conferenceData.entryPoints
// //     ) {
// //       return response.data.conferenceData.entryPoints[0].uri;
// //     } else {
// //       throw new Error("No meeting link found in response.");
// //     }
// //   } catch (error) {
// //     console.error(
// //       "Error generating Google Meet Link",
// //       error.response ? error.response.data : error.message
// //     );
// //     throw new Error("Failed to generate Google Meet Link.");
// //   }
// // };

// // module.exports = { generateMeetLink };

// // 2nd try
// const axios = require("axios");
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;

// // Function to generate a Google Meet link for a consultation
// const generateMeetLink = async (teacherId, consultationTime) => {
//   // Set up OAuth2 client with credentials
//   const oauth2Client = new OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     "http://localhost:5173/oauth2callback"
//   );

//   // Set the access token (you should manage the refresh token flow and retrieve the access token)
//   oauth2Client.setCredentials({
//     access_token: process.env.ACCESS_TOKEN,
//     refresh_token: process.env.REFRESH_TOKEN,
//   });

//   const calendar = google.calendar({ version: "v3", auth: oauth2Client });

//   // Create event details for the consultation meeting
//   const event = {
//     summary: "Consultation Meeting",
//     description: "Scheduled Consultation",
//     start: {
//       dateTime: new Date(consultationTime).toISOString(),
//       timeZone: "UTC",
//     },
//     end: {
//       dateTime: new Date(
//         new Date(consultationTime).getTime() + 60 * 60 * 1000
//       ).toISOString(),
//       timeZone: "UTC",
//     },
//     conferenceData: {
//       createRequest: {
//         requestId: "consultation-meeting-" + teacherId,
//         conferenceSolutionKey: { type: "hangoutsMeet" },
//       },
//     },
//   };

//   try {
//     // Create the event in the Google Calendar
//     const response = await calendar.events.insert({
//       calendarId: "primary",
//       resource: event,
//       conferenceDataVersion: 1, // Important to request meeting link
//     });

//     if (
//       response.data.conferenceData &&
//       response.data.conferenceData.entryPoints
//     ) {
//       // If Google returns a valid conference link, extract and return it
//       return response.data.conferenceData.entryPoints[0].uri;
//     } else {
//       throw new Error("Failed to generate Google Meet Link.");
//     }
//   } catch (error) {
//     console.error("Error generating Google Meet Link:", error);
//     throw new Error("Failed to generate Google Meet Link.");
//   }
// };

// module.exports = { generateMeetLink };

// // const axios = require("axios");
// // const { google } = require("googleapis");
// // const dotenv = require("dotenv");
// // const OAuth2 = google.auth.OAuth2;

// // dotenv.config();

// // const generateMeetLink = async (teacherId, consultationTime) => {
// //   console.log("MeetLink 01: ");
// //   console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
// //   const oauth2Client = new OAuth2(
// //     process.env.CLIENT_ID,
// //     process.env.CLIENT_SECRET,
// //     "http://localhost:5173/oauth2callback"
// //   );

// //   // Set credentials from environment variables
// //   console.log("Link Generation: ");
// //   console.log(process.env.ACCESS_TOKEN, process.env.REFRESH_TOKEN);
// //   oauth2Client.setCredentials({
// //     access_token: process.env.ACCESS_TOKEN,
// //     refresh_token: process.env.REFRESH_TOKEN,
// //   });

// //   // Check if the access token is expiring soon, and refresh if necessary
// //   if (oauth2Client.isAccessTokenExpiring()) {
// //     await oauth2Client.refreshAccessToken();
// //   }

// //   const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// //   // Event details
// //   const event = {
// //     summary: "Consultation Meeting",
// //     description: "Scheduled Consultation",
// //     start: {
// //       dateTime: new Date(consultationTime).toISOString(),
// //       timeZone: "UTC",
// //     },
// //     end: {
// //       dateTime: new Date(
// //         new Date(consultationTime).getTime() + 60 * 60 * 1000
// //       ).toISOString(),
// //       timeZone: "UTC",
// //     },
// //     conferenceData: {
// //       createRequest: {
// //         requestId: "consultation-meeting-" + teacherId,
// //         conferenceSolutionKey: { type: "hangoutsMeet" },
// //       },
// //     },
// //   };

// //   try {
// //     // Create the event in Google Calendar
// //     const response = await calendar.events.insert({
// //       calendarId: "primary", // Primary calendar of the authenticated user
// //       resource: event,
// //       conferenceDataVersion: 1,
// //     });

// //     if (
// //       response.data.conferenceData &&
// //       response.data.conferenceData.entryPoints
// //     ) {
// //       // Return the Google Meet link
// //       return response.data.conferenceData.entryPoints[0].uri;
// //     } else {
// //       throw new Error("Failed to generate Google Meet Link.");
// //     }
// //   } catch (error) {
// //     console.error(
// //       "Error generating Google Meet Link:",
// //       error.response ? error.response.data : error.message
// //     );
// //     throw new Error("Failed to generate Google Meet Link.");
// //   }
// // };

// // module.exports = { generateMeetLink };
