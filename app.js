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
    showJobs();
    createDropdown(); 
  })
  .catch(error => console.error('Error with loading:', error));

function showJobs(jobs) {
  // Make container empty
  jobList.innerHTML = ''; 
  
  // Filteren
  const filteredJobs = jobsData.filter(job => {
    if (activeFilters.length === 0) return true;
    
    // Verzamel alle tags van deze job in één lijst
    const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
    
    // Check of ALLE actieve filters in de job tags zitten
    return activeFilters.every(filter => jobTags.includes(filter));
  });

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

    jobList.appendChild(jobCard);
  });
}

// Dropdown filter
function createDropdown() {
  const dropdown = document.getElementById('filter-dropdown');
  const uniqueTags = new Set();

  // Get new tags
  jobsData.forEach(job => {
    uniqueTags.add(job.role);
    uniqueTags.add(job.level);
    job.languages.forEach(lang => uniqueTags.add(lang));
    job.tools.forEach(tool => uniqueTags.add(tool));
  });

 
  const sortedTags = Array.from(uniqueTags).sort();

  sortedTags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    dropdown.appendChild(option);
  });

  // Listen to change
  dropdown.addEventListener('change', (event) => {
    const selectedTag = event.target.value;
    
    if (selectedTag !== "") {
      addFilter(selectedTag); 
      event.target.value = ""; 
    }
  });
}

function filterAndShowJobs() {
  if (activeFilters.length === 0) {
    showJobs(jobsData);
    return;
  }

  // Filter the list
  const filteredJobs = jobsData.filter(job => {
    
    const jobTags = [
      job.role, 
      job.level, 
      ...job.languages, 
      ...job.tools
    ];

    const isMatch = activeFilters.every(filter => {
      return jobTags.includes(filter);
    });

    return isMatch; 
  });

  showJobs(filteredJobs);
}

// Add filter
window.addFilter = function(tag) {
  if (!activeFilters.includes(tag)) {
    activeFilters.push(tag);
    
    updateFilterUI();      
    filterAndShowJobs(); 
  }
};

// Delete filter
window.removeFilter = function(tag) {
  activeFilters = activeFilters.filter(f => f !== tag);
  updateFilterUI();
  filterAndShowJobs(); 
};

// Update filter bar
function updateFilterUI() {
  filterTags.innerHTML = activeFilters.map(filter => `
    <div class="filter-tablet">
      <span class="filter-name">${filter}</span>
      <button class="remove-btn" onclick="removeFilter('${filter}')">×</button>
    </div>
  `).join('');
}

// Clear button
clearBtn.addEventListener('click', () => {
  activeFilters = [];
  updateFilterUI();
  renderJobs();
});

