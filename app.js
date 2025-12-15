let jobsData = [];
let activeFilters = [];

const filterContainer = document.getElementById('filter-container');
let filterTags = document.getElementById('filter-tags');
const clearBtn = document.getElementById('clear-btn');
let jobList = document.getElementById('job-list');

fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    // Getting the data
    jobsData = data; 
    console.log(jobsData);
  });
