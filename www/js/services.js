angular.module('starter.services', ['ngResource'])


.factory('User', function($http, $resource, ApiEndpoint) {
  var User;
  User = $resource(ApiEndpoint.url , {device_token: "@user", page: "@page", access_token: '@access_token'},
    {
      signIn: {
        url: ApiEndpoint.url + "/api/sessions.json",
        method: 'POST'
      },
      getUsers: {
        url: ApiEndpoint.url + "/api/users.json",
        method: 'GET'
      }
    });

  return User;
})

.factory('Feedback', function($http, $resource, ApiEndpoint) {
  var Feedback;
  Feedback = $resource(ApiEndpoint.url + '/api/users/:user_id/feedbacks.json', {access_token: '@access_token', user_id: '@user_id'},
    {
      postFeedback: {
        url: ApiEndpoint.url + "/api/users/:user_id/feedbacks.json",
        method: 'POST'
      },
      getDashboardInfo: {
        url: ApiEndpoint.url + "/api/dashboard.json",
        method: 'GET'
      },
      getList: {
        method: 'GET'
      },
      getAllFeeds: {
        url: ApiEndpoint.url + "/api/users/:user_id/feedbacks/all_feedbacks.json",
        method: 'GET',
        array: true
      }
    });

  return Feedback;
})



.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
