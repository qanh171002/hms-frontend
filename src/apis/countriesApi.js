import axios from "axios";

let cachedCountries = null;

export const getCountries = async () => {
  if (cachedCountries) return cachedCountries;
  // Using REST Countries v3.1 API
  const url = "https://restcountries.com/v3.1/all?fields=name,cca2,flags";
  const res = await axios.get(url);
  const countries = (res.data || [])
    .map((c) => ({
      name: c?.name?.common || "",
      code: c?.cca2 || "",
      flagPng: c?.flags?.png || "",
      flagSvg: c?.flags?.svg || "",
    }))
    .filter((c) => c.name);
  countries.sort((a, b) => a.name.localeCompare(b.name));
  cachedCountries = countries;
  return countries;
};
