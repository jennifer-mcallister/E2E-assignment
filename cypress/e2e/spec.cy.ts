const searchText :string = "hello";
const movieTitle :string = "Hello world";
const pathToPoster :string = "image";


const movies :{} = {Search:[
    {
      Title: "Hello world",
      imdbID: "ID",
      Type: "movie",
      Poster: "image",
      Year: "1234",
    },
    {
      Title: "Hello world",
      imdbID: "ID",
      Type: "movie",
      Poster: "image",
      Year: "1234",
    },
    {
      Title: "Hello world",
      imdbID: "ID",
      Type: "movie",
      Poster: "image",
      Year: "1234",
    }
]};

beforeEach (()=> {
  cy.visit('http://localhost:1234');
  cy.intercept("GET", "http://omdbapi.com/*", movies).as("moviesCall");
});


describe('userexperience flow', () => {
  
  it('should be able to type', () => {

    cy.get("input").type(searchText).should("have.value", searchText);

  });

  it('should be able to click', () => {

    cy.get("input").type(searchText).should("have.value", searchText);
    cy.get("button").click(); 

  });

  it('should be able to search and get data', () => {

    cy.get("input").type(searchText).should("have.value", searchText);
    cy.get("button").click(); 
    cy.wait("@moviesCall");
    cy.get("div#movie-container > div.movie").should("have.length", 3);
    cy.get("div.movie:first > h3").contains(movieTitle);
    cy.get("div.movie:first").find("img").should("have.attr", "src", pathToPoster);

  });
});


describe("API call", ()=> {

  it("should get fake requested url", ()=> {

    cy.intercept("GET", "http://omdbapi.com/*", movies).as("moviesCall");
    cy.get("input").type(searchText).should("have.value", searchText);
    cy.get("button").click();
    cy.wait("@moviesCall").its("request.url").should("contain", "=hello");

  });

  it("should get error", ()=> {

    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=", {forceNetworkError: true}).as("err");

    cy.get("button").click();
    cy.wait("@err").should("have.property", "error");
    cy.get("div#movie-container > p").contains("Inga sökresultat att visa");
    
  });
});

