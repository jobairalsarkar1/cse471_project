// const axios = require("axios");

// const generateMeetLink = async (teacherId, consultationTime) => {
//   const googleApiToken = process.env.GOOGLE_API_TOKEN;
//   try {
//     const response = await axios.post(
//       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
//       {
//         summary: "Consultation Meeting",
//         description: "Scheduled Consultation",
//         start: {
//           dateTime: new Date(consultationTime).toISOString(),
//           timeZone: "UTC",
//         },
//         end: {
//           dateTime: new Date(
//             new Date(consultationTime).getTime() + 60 * 60 * 1000
//           ).toISOString(),
//           timeZone: "UTC",
//         },
//         conferenceData: {
//           createRequest: {
//             requestId: "21205000-jas-goodboy",
//             conferenceSolutionKey: { type: "hangoutsMeet" },
//           },
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${googleApiToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (
//       response.data.conferenceData &&
//       response.data.conferenceData.entryPoints
//     ) {
//       return response.data.conferenceData.entryPoints[0].uri;
//     } else {
//       throw new Error("No meeting link found in response.");
//     }
//   } catch (error) {
//     console.error(
//       "Error generating Google Meet Link",
//       error.response ? error.response.data : error.message
//     );
//     throw new Error("Failed to generate Google Meet Link.");
//   }
// };

// module.exports = { generateMeetLink };

const axios = require("axios");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Function to generate a Google Meet link for a consultation
const generateMeetLink = async (teacherId, consultationTime) => {
  // Set up OAuth2 client with credentials
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:5173/oauth2callback"
  );

  // Set the access token (you should manage the refresh token flow and retrieve the access token)
  oauth2Client.setCredentials({
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Create event details for the consultation meeting
  const event = {
    summary: "Consultation Meeting",
    description: "Scheduled Consultation",
    start: {
      dateTime: new Date(consultationTime).toISOString(),
      timeZone: "UTC",
    },
    end: {
      dateTime: new Date(
        new Date(consultationTime).getTime() + 60 * 60 * 1000
      ).toISOString(),
      timeZone: "UTC",
    },
    conferenceData: {
      createRequest: {
        requestId: "consultation-meeting-" + teacherId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  try {
    // Create the event in the Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1, // Important to request meeting link
    });

    if (
      response.data.conferenceData &&
      response.data.conferenceData.entryPoints
    ) {
      // If Google returns a valid conference link, extract and return it
      return response.data.conferenceData.entryPoints[0].uri;
    } else {
      throw new Error("Failed to generate Google Meet Link.");
    }
  } catch (error) {
    console.error("Error generating Google Meet Link:", error);
    throw new Error("Failed to generate Google Meet Link.");
  }
};

module.exports = { generateMeetLink };
