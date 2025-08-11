const countryName = new URLSearchParams(location.search).get('name');
const flagImage = document.querySelector('.country-details img');
const countryNameH1 = document.querySelector('.country-details h1');
const nativeName = document.querySelector('.native-name');
const population = document.querySelector('.population');
const region = document.querySelector('.region');
const subRegion = document.querySelector('.sub-region');
const capital = document.querySelector('.capital');
const topLevelDomain = document.querySelector('.top-level-domain');
const currencies = document.querySelector('.currencies');
const languages = document.querySelector('.languages');
const borderCountries = document.querySelector('.border-countries');

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then((res) => {
    if (!res.ok) throw new Error('Country not found');
    return res.json();
  })
  .then((data) => {
    if (!data || data.length === 0) {
      throw new Error('No country data returned');
    }

    const [country] = data;

    flagImage.src = country.flags?.svg || 'fallback-flag.svg';
    countryNameH1.innerText = country.name?.common || 'Unknown';
    nativeName.innerText = Object.values(country.name?.nativeName || {})[0]?.common || country.name?.common || 'Unknown';
    population.innerText = country.population?.toLocaleString('en-IN') || 'N/A';
    region.innerText = country.region || 'N/A';
    subRegion.innerText = country.subregion || 'N/A';
    capital.innerText = country.capital?.[0] || 'N/A';
    topLevelDomain.innerText = country.tld?.join(', ') || 'N/A';
    currencies.innerText = Object.values(country.currencies || {})
      .map((currency) => currency.name)
      .join(', ') || 'N/A';
    languages.innerText = Object.values(country.languages || {}).join(', ') || 'N/A';

    
    if (country.borders) {
      country.borders.forEach((border) => {
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then((res) => {
            if (!res.ok) throw new Error(`Border country ${border} not found`);
            return res.json();
          })
          .then(([borderCountry]) => {
            const borderCountryTag = document.createElement('a');
            borderCountryTag.innerText = borderCountry.name.common;
            borderCountryTag.href = `country.html?name=${borderCountry.name.common}`;
            borderCountries.append(borderCountryTag);
          })
          .catch((err) => {
            console.warn(`Failed to fetch border country ${border}:`, err);
          });
      });
    }
  })
  .catch((err) => {
    console.error(err);
    document.querySelector('.country-details-container').innerHTML = `
      <p style="text-align:center;">Country not found. Please check the name or go back.</p>
    `;
  });