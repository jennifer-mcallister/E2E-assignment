const searchText :string = "star";
const movieTitle :string = "Star Wars: Episode IV - A New Hope";
const pathToPoster :string = "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg";
// anpassa testet efter den "mockade" api anropet
const movies :{} = [
    {
      Title: "Hello world",
      Poster: "image",
    },
    {
      Title: "Hello world",
      Poster: "image",
    },
    {
      Title: "Hello world",
      Poster: "image",
    }
];
// bättre namn i describtion
describe('userexperience for search functionality', () => {
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
});

// lägg fake API anroppet i en beforeEach((=>{})) innan alla "its"
describe("API call", ()=> {
  it("should get fake data", ()=> {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=", {movies}).as("moviesCall");
    
    cy.visit('http://localhost:1234');
    cy.get("button").click();
    cy.wait("@moviesCall");
    // kolla att det som du förväntar dig kommer upp
    // lägg till det soms står i dokumentationen
  });

  it("should get fake API", ()=> {
    cy.intercept("GET", "http://omdbapi.com/*", {movies}).as("moviesCall");
    
    cy.visit('http://localhost:1234');
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

