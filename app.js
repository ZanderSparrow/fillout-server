require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()
const port = process.env.PROD ? 80 : 3003

async function getFormData(url = "") {
  const config = {
    headers: { Authorization: `Bearer ${process.env.ACCOUNT_ID}` }
  };

  return axios.get(
    url,
    config
  ).then(res => res.data).catch(console.log);
}

const filters = {
  "equals" : (value, current) => value === current ? true : false,
  "does_not_equal": (value, current) => value != current ? true : false,
  "greater_than": (value, current) => current > value ? true : false,
  "less_than": (value, current) => current < value ? true : false
}

app.get('/:formId/filteredResponses', (req, res) => {
  // Query should be filter: JSON.stringify(desired filters)
  const queryFilters = JSON.parse(req.query?.filter)
  
  getFormData(`https://api.fillout.com/v1/api/forms/${process.env.FORM_ID}/submissions`).then((data) => {
    let filteredData = {
      totalResponses: data.totalResponses,
      pageCount: data.pageCount
    }

    // Create a new filtered array of responses that contain at least one of the filtered criteria
    // and no mismatches
    let responsesFiltered = data.responses.filter(response => {
      let addResonse = false;
      let mismatch = false;
      response.questions.forEach(question => {
        queryFilters.forEach(filter => {
          if (filter.id === question.id) {
            if(filters[filter.condition](filter.value, question.value)) {
              addResonse = true;
            } else {
              mismatch = true;
            }
          }
        })
      })
      return addResonse && !mismatch;
    })

    filteredData["responses"] = responsesFiltered;

    res.send(filteredData);
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}.`)
})
