# Example Express Server
This is a simple express server that filters data returned from another API.

## Making a query
The API is live at `https://fillout-server-j84o.onrender.com` with one endpoint
at /:formID/filteredResponses. The form ID should match the example provided. To add a filter
use a query key `filter` with a JSON stringified value containing a list of filters.
