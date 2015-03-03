describe('Ifl.login', function() {
  var xhr;
  var requests;

  beforeEach(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
  });

  describe("setting urls", function() {
    it("sets a production url", function() {
      Ifl.login.setProductionUrl();
      expect(Ifl.login.productionApiUrl).to.equal('https://iflauthexample-webapp.herokuapp.com');
    });

    it("sets a development url", function() {
      Ifl.login.setDevelopmentUrl();
      expect(Ifl.login.developmentApiUrl).to.equal('http://localhost:3000');
    });
  });

  it("sets the current user", function() {
    var responseData = { firstname:"Cool", lastname: "Person", token: "abc123"};
    Ifl.login.setCurrentUser(responseData);
    expect(Ifl.currentUser.firstname).to.equal("Cool");
    expect(Ifl.currentUser.lastname).to.equal("Person");
    expect(Ifl.currentUser.token).to.equal("abc123");
  });

  describe("cacheElements", function() {

    beforeEach(function() {
      appendFixture("div", { id: "loginContainer"});
      appendFixture("input", { id: "email-field", type: "text", name: "email"});
      appendFixture("input", { id: "password-field", type: "password", name: "password"});
      appendFixture("input", { id: "submit", type: "button"});
      appendFixture("div", { id: "gameContainer"});
      Ifl.login.cacheElements();
    });

    it("saves a reference to the login container", function() {
      expect(Ifl.login.$loginContainer).to.exist;
      expect(Ifl.login.$loginContainer).to.have.id("loginContainer");
    });

    it("saves a reference to the email field", function() {
      expect(Ifl.login.$email).to.exist;
      expect(Ifl.login.$email).to.have.id("email-field");
    });

    it("saves a reference to the password field", function() {
      expect(Ifl.login.$password).to.exist;
      expect(Ifl.login.$password).to.have.id("password-field");
    });

    it("saves a reference to the submit button", function() {
      expect(Ifl.login.$submit).to.exist;
      expect(Ifl.login.$submit).to.have.id("submit");
    });

    it("saves a reference to the game container", function() {
      expect(Ifl.login.$gameContainer).to.exist;
      expect(Ifl.login.$gameContainer).to.have.id("gameContainer");
    });
  });

  describe("registerEvents", function() {
    afterEach(function() {
      Ifl.login.loginUser.restore();
    });

    it("registers the submit click event", function() {
      appendFixture("input", { id: "submit", type: "button"});
      Ifl.login.cacheElements();
      sinon.stub(Ifl.login, "loginUser");
      Ifl.login.registerEvents();
      Ifl.login.$submit.trigger("click");
      expect(Ifl.login.loginUser).to.have.been.called
    });
  });

  describe("LoginUser", function() {
    beforeEach(function() {
      appendFixture("input", { id: "submit", type: "button"});
      appendFixture("input", { id: "email-field", type: "text", name: "email", value: "dev@ifl.org"});
      appendFixture("input", { id: "password-field", type: "password", name: "password", value: "1234"});
      var callback = function() {
         console.log("Success");
      }
      Ifl.login.initialize(callback);
    });

    it("calls to the api with proper credentials", function() {
      Ifl.login.loginUser();
      var request = _.first(requests);
      expect(request.method).to.equal("POST");
      expect(request.url).to.equal("https://iflauthexample-webapp.herokuapp.com/users/sign_in.json");
      expect(request.requestHeaders.Accept).to.match(/application\/json/);
    });

    it("sets the current user on loginSuccess", function() {
      var callback = function() {
        console.log("Success");
      }
      Ifl.login.initialize(callback);
      var responseData = { firstname:"Cool", lastname: "Person", token: "abc123"};
      Ifl.login.loginSuccess(responseData);
      expect(Ifl.currentUser).to.equal(responseData);
      expect(Ifl.currentUser.firstname).to.equal("Cool");
      expect(Ifl.currentUser.lastname).to.equal("Person");
      expect(Ifl.currentUser.token).to.equal("abc123");
    });

    it("it does not set the current user on login failure", function() {
      Ifl.login.loginUser();
      expect(Ifl.login.currentUser).to.be.nil
    });
  });
});
