const searchText :string = "star";
const movieTitle :string = "Star Wars: Episode IV - A New Hope";
const pathToPoster :string = "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg"
const movies :[{}] = [{
    Title: "Hello world",
    imdbID: "ID",
    Type: "movie",
    Poster: "image",
    Year: "1234",
}];

describe('testing search engine', () => {
  it('should be able to type', () => {
    cy.visit('http://localhost:1234');

    cy.get("input").type(searchText).should("have.value", searchText);
  });

  it('should be able to click', () => {
    cy.visit('http://localhost:1234');

    cy.get("input").type(searchText).should("have.value", searchText);

    cy.get("button").click(); 
  });

  it('should be able to search', () => {
    cy.visit('http://localhost:1234');

    cy.get("input").type(searchText).should("have.value", searchText);
    cy.get("button").click(); 
    cy.get("div#movie-container > div.movie").should("have.length", 10);
    cy.get("div.movie:first > h3").contains(movieTitle);
    cy.get("div.movie:first").find("img").should("have.attr", "src", pathToPoster);
  });

  it('should get error message', () => {
    cy.visit('http://localhost:1234');

    cy.get("input").type("s").should("have.value", "s");
    cy.get("button").click(); 
    cy.get("div#movie-container > p").contains("Inga sökresultat att visa");
  });

  it("should get fake data", ()=> {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=", {movies}).as("moviesCall");
    
    cy.visit('http://localhost:1234');
    cy.get("button").click();
    cy.wait("@moviesCall");
  });

  it("should get error", ()=> {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=", {forceNetworkError: true}).as("err");
    
    cy.visit('http://localhost:1234');
    cy.get("button").click();
    cy.wait("@err").should("have.property", "error");
  });
});