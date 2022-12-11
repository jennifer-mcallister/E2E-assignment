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

// bättre namn i describtion
describe('userexperience flow', () => {
  it('should be able to type', () => {

    cy.get("input").type(searchText).should("have.value", searchText);
  });

  it('should be able to click', () => {

    cy.get("input").type(searchText).should("have.value", searchText);

    cy.get("button").click(); 
  });

  it('should be able to search', () => {

    cy.get("input").type(searchText).should("have.value", searchText);
    cy.get("button").click(); 
    cy.wait("@moviesCall");
    cy.get("div#movie-container > div.movie").should("have.length", 3);
    cy.get("div.movie:first > h3").contains(movieTitle);
    cy.get("div.movie:first").find("img").should("have.attr", "src", pathToPoster);
  });

});


describe("API call", ()=> {
  it("should get fake data", ()=> {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=", movies).as("moviesCall");
    
    cy.get("button").click();
    cy.wait("@moviesCall");
    // kolla att det som du förväntar dig kommer upp
    // lägg till det soms står i dokumentationen
  });

  it("should get fake API", ()=> {
    cy.intercept("GET", "http://omdbapi.com/*", movies).as("moviesCall");
    
    cy.get("button").click();
    cy.wait("@moviesCall").its("request.url").should("contain", "");
    // kolla att det som du förväntar dig kommer upp
    // lägg till det soms står i dokumentationen
  });

  it("should get error", ()=> {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=", {forceNetworkError: true}).as("err");
    
    cy.visit('http://localhost:1234');
    cy.get("button").click();
    cy.wait("@err").should("have.property", "error");
    // kolla att rätt saker händer i webbläsaren när det blir error
  });
});

