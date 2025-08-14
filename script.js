
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-icon');


searchIcon.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    window.location.href = `country.html?name=${encodeURIComponent(query)}`
  }
});


searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `country.html?name=${encodeURIComponent(query)}`
    }
  }
});





const countriesContainer = document.querySelector('.countries-container')
const filterByRegion = document.querySelector('.filter-by-region')

const themeChanger = document.querySelector('.theme-changer')


const fields = 'name,population,region,subregion,capital,tld,currencies,languages,flags'
fetch(`https://restcountries.com/v3.1/all?fields=${fields}`)
.then((res) => { if(!res.ok) throw new Error('Failed to fetch countries')
  return   res.json()})
.then((data) => {
    renderCountries(data)
    allCountriesData = data
  })
  .catch((err)=>{
    console.error(err)
    countriesContainer.innerHTML = `<p style="text-align:center;">Unable to load countries.
     Please try again later.</p>`
  })

filterByRegion.addEventListener('change', (e) => {
  fetch(`https://restcountries.com/v3.1/region/${filterByRegion.value}`)
    .then((res) => res.json())
    .then(renderCountries)
})

function renderCountries(data) {
  countriesContainer.innerHTML = ''
  data.forEach((country) => {
    const countryCard = document.createElement('a')
    countryCard.classList.add('country-card')
    countryCard.href = `/country.html?name=${country.name.common}`
    countryCard.innerHTML = `
          <img src="${country.flags.svg}" alt="${country.name.common} flag" />
          <div class="card-text">
              <h3 class="card-title">${country.name.common}</h3>
              <p><b>Population: </b>${country.population.toLocaleString(
                'en-IN'
              )}</p>
              <p><b>Region: </b>${country.region}</p>
              <p><b>Capital: </b>${country.capital?.[0]}</p>
          </div>
  `
    countriesContainer.append(countryCard)
  })
}


searchInput.addEventListener('input',  (e) => {
  const filteredCountries = allCountriesData.filter((country) => country.name.common.toLowerCase().includes(e.target.value.toLowerCase()))
  renderCountries(filteredCountries)
})

themeChanger.addEventListener('click', () => {
  document.body.classList.toggle('dark')
})




