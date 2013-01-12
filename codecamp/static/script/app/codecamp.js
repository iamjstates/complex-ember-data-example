CodeCamp = Ember.Application.create();

DS.DjangoRESTAdapter.configure("plurals", {"company" : "companies"});

CodeCamp.Tag = DS.Model.extend({
  description: DS.attr('string')
});

CodeCamp.Association = DS.Model.extend({
  name: DS.attr('string'),
  speakers: DS.hasMany('CodeCamp.Speaker')
});

CodeCamp.Session = DS.Model.extend({
  name: DS.attr('string'),
  room: DS.attr('string'),
  speakers: DS.hasMany('CodeCamp.Speaker'),
  ratings: DS.hasMany('CodeCamp.Rating'),
  tags: DS.hasMany('CodeCamp.Tag')
});

CodeCamp.Speaker = DS.Model.extend({
  name: DS.attr('string'),
  location: DS.attr('string'),
  session: DS.belongsTo('CodeCamp.Session'),
  association: DS.belongsTo('CodeCamp.Association'),
  personas: DS.hasMany('CodeCamp.Persona')
});

CodeCamp.Rating = DS.Model.extend({
  score: DS.attr('number'),
  feedback: DS.attr('string'),
  session: DS.belongsTo('CodeCamp.Session')
});

CodeCamp.Company = DS.Model.extend({
    name: DS.attr('string'),
    sponsors: DS.hasMany('CodeCamp.Sponsor'),
    persona: DS.belongsTo('CodeCamp.Persona')
});

CodeCamp.Persona = DS.Model.extend({
    nickname: DS.attr('string'),
    speaker: DS.belongsTo('CodeCamp.Speaker'),
    company: DS.belongsTo('CodeCamp.Company')
});

CodeCamp.Sponsor = DS.Model.extend({
    name: DS.attr('string'),
    company: DS.belongsTo('CodeCamp.Company')
});

CodeCamp.Store = DS.Store.extend({
  revision: 11,
  adapter: DS.DjangoRESTAdapter.create({
      namespace: 'codecamp'
  })
});

CodeCamp.SessionsController = Ember.ArrayController.extend({
  content: []
});

CodeCamp.SessionView = Ember.View.extend({
  templateName: 'session',
  addRating: function(event) {
    if (this.formIsValid()) {
      var rating = this.buildRatingFromInputs(event);
      this.get('controller').addRating(rating);
      this.resetForm();
    }
  },
  buildRatingFromInputs: function(session) {
    var score = this.get('score');
    var feedback = this.get('feedback');
    return CodeCamp.Rating.createRecord(
    { score: score,
      feedback: feedback,
      session: session
    });
  },
  formIsValid: function() {
    var score = this.get('score');
    var feedback = this.get('feedback');
    if (score === undefined || feedback === undefined || score.trim() === "" || feedback.trim() === "") {
      return false;
    }
    return true;
  },
  resetForm: function() {
    this.set('score', '');
    this.set('feedback', '');
  }
});

CodeCamp.SessionController = Ember.ObjectController.extend({
  content: null,
  addRating: function(rating) {
    this.get('store').commit();
  }
});

CodeCamp.Router.map(function(match) {
  match("/").to("sessions");
  match("/associations").to("associations");
  match("/session/:session_id").to("session");
  match("/speaker/:speaker_id").to("speaker");
});

CodeCamp.SessionRoute = Ember.Route.extend({
  model: function(params) {
      return CodeCamp.Session.find(params.session_id);
  }
});

CodeCamp.SessionsRoute = Ember.Route.extend({
  model: function() {
    return CodeCamp.Session.find();
  }
});

CodeCamp.AssociationsController = Ember.ArrayController.extend({
    content: []
});

CodeCamp.AssociationsRoute = Ember.Route.extend({
  model: function() {
    return CodeCamp.Association.find();
  }
});