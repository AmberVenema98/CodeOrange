let jobsData = [];
let activeFilters = [];

// Sellecting elements
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

function showJobs(jobs) {
  // Make container empty
  jobContainer.innerHTML = '';  

// Loop through jobs
  filteredJobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.className = `job-card ${job.featured ? 'featured' : ''}`;

    // Tags array for buttons
    const tags = [job.role, job.level, ...job.languages, ...job.tools];
    
    // Whole job card
    jobCard.innerHTML = `
      <div class="job-left">
        <div class="logo">
          <img src="${job.logo}" alt="${job.company}">
        </div>
        <div class="job-info">
          <div class="company-row">
            <span class="company">${job.company}</span>
            ${job.new ? '<span class="pill new">New!</span>' : ''}
            ${job.featured ? '<span class="pill featured">Featured</span>' : ''}
          </div>
          <h2 class="position">${job.position}</h2>
          <ul class="details">
            <li>${job.postedAt}</li>
            <li>${job.contract}</li>
            <li>${job.location}</li>
          </ul>
        </div>
      </div>
      <div class="job-tags">
        ${tags.map(tag => `<button class="tag" onclick="addFilter('${tag}')">${tag}</button>`).join('')}
      </div>
    `;

    jobListContainer.appendChild(jobCard);
  });
}


