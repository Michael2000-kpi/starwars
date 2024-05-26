import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Filter from "./components/Filter"; // Importing Filter component
import Card from "./components/Card"; // Importing Card component
import "./App.css";

const App = () => {
  // State variables for window dimensions, people data, pagination, sorting, and selected person
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [people, setPeople] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const itemsPerPage = 10;

  // Effect hook to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect hook to fetch people data based on pagination and sorting
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        // Define the base URL for fetching people
        let url = `https://sw-api.starnavi.io/people/?page=${currentPage + 1}`;

        // Append sorting parameter to the URL
        url += `&ordering=${sortBy}`;

        // Perform the API request
        const response = await axios.get(url);

        // Sort the response data based on the sorting parameter
        const sortedPeople = [...response.data.results].sort((a, b) => {
          if (a[sortBy] < b[sortBy]) return -1;
          if (a[sortBy] > b[sortBy]) return 1;
          return 0;
        });

        // Set the sorted people data and calculate the page count
        setPeople(sortedPeople);
        setPageCount(Math.ceil(response.data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPeople();
  }, [currentPage, sortBy]);

  // Function to handle pagination click
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // CSS grid template styles based on window width
  const gridTemplateRows =
    windowWidth <= 678
      ? "50px 50px 50px 1fr 50px 50px 50px"
      : "80px auto 1fr auto 50px";

  const gridTemplateColumns = windowWidth <= 678 ? "1fr" : "1fr 4fr 1fr";

  const gridTemplateAreas =
    windowWidth <= 678
      ? `'header'
         'banner'
         'left-aside'
         'main'
         'right-aside'
         'low-content'
         'footer'`
      : `'header header header'
         'left-aside banner right-aside'
         'left-aside main right-aside'
         'left-aside low-content right-aside'
         'footer footer footer'`;

  // JSX structure of the application
  return (
    <div
      className="container"
      style={{ gridTemplateRows, gridTemplateColumns, gridTemplateAreas }}
    >
      {/* Header section */}
      <header className="header">Star Wars: by Mykhailo Hamar</header>

      {/* Left sidebar section */}
      <aside className="left-aside"></aside>

      {/* Main content section */}
      <main className="main">
        {selectedPerson ? (
          // If a person is selected, render their card details
          <Card
            person={selectedPerson}
            onBack={() => setSelectedPerson(null)}
          />
        ) : (
          // If no person is selected, render a list of people in two columns
          <div className="column">
            <ul className="firstColumn">
              {/* Mapping through people data to render every second person in the first column */}
              {people.map(
                (person, index) =>
                  index % 2 === 0 && (
                    <li key={person.name} className="person-box">
                      {/* Clickable person details */}
                      <div
                        className="person-link"
                        onClick={() => setSelectedPerson(person)}
                      >
                        <p>
                          <strong>Name:</strong> {person.name}
                        </p>
                        <p>
                          <strong>Height:</strong> {person.height}
                        </p>
                        <p>
                          <strong>Mass:</strong> {person.mass}
                        </p>
                        <p>
                          <strong>Hair Color:</strong> {person.hair_color}
                        </p>
                        <p>
                          <strong>Skin Color:</strong> {person.skin_color}
                        </p>
                        <p>
                          <strong>Eye Color:</strong> {person.eye_color}
                        </p>
                        <p>
                          <strong>Birth Year:</strong> {person.birth_year}
                        </p>
                        <p>
                          <strong>Gender:</strong> {person.gender}
                        </p>
                      </div>
                    </li>
                  )
              )}
            </ul>
            <ul className="secondColumn">
              {/* Mapping through people data to render every second person in the second column */}
              {people.map(
                (person, index) =>
                  index % 2 !== 0 && (
                    <li key={person.name} className="person-box">
                      {/* Clickable person details */}
                      <div
                        className="person-link"
                        onClick={() => setSelectedPerson(person)}
                      >
                        <p>
                          <strong>Name:</strong> {person.name}
                        </p>
                        <p>
                          <strong>Height:</strong> {person.height}
                        </p>
                        <p>
                          <strong>Mass:</strong> {person.mass}
                        </p>
                        <p>
                          <strong>Hair Color:</strong> {person.hair_color}
                        </p>
                        <p>
                          <strong>Skin Color:</strong> {person.skin_color}
                        </p>
                        <p>
                          <strong>Eye Color:</strong> {person.eye_color}
                        </p>
                        <p>
                          <strong>Birth Year:</strong> {person.birth_year}
                        </p>
                        <p>
                          <strong>Gender:</strong> {person.gender}
                        </p>
                      </div>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
      </main>

      {/* Banner section with filter component */}
      <section className="banner">
        <Filter
          className="my-select-menu"
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </section>

      {/* Right sidebar section */}
      <aside className="right-aside"></aside>

      {/* Pagination section */}
      <section className="low-content">
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </section>
    </div>
  );
};

export default App;
