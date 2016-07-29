angular.module('starter.controllers', ['starter.services'])

.constant('ApiEndpoint', {
  // url: 'https://posiback-api.herokuapp.com/'
  url: 'http://8e23d9b3.ngrok.io'
})
.constant('_',window._)

.controller('DashCtrl', function($scope, $ionicModal, $timeout, User, $localStorage, Feedback, $ionicHistory, $state) {

  $scope.credentials = {email: null, password: null};
  $scope.mdlSignin = null;
  $scope.feedbacks = null;
  $scope.labels = [];
  $scope.data = [];

  $ionicModal.fromTemplateUrl('templates/signin.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.mdlSignin = modal;
    if(localStorage.getItem('posiback-token')) {
      $scope.getDashboardInfo();
    } else {
      modal.show();
    }
  });

  $scope.closeDetail = function() {
    $scope.mdlSignin.hide();
  };

  $scope.openSignin = function() {
    $scope.mdlSignin.show();
  };

  $scope.signIn = function(credentials) {
    User.signIn({credentials: {email: credentials.email, password: credentials.password, device_token: localStorage.getItem('device-token')}}).$promise.then(function(res){
      localStorage.setItem('posiback-token', res.access_token);
      localStorage.setItem('posiback-userId', res.id);
      $ionicHistory.clearCache();
      $state.go('tab.dash', {"reload": "true"}, { reload: true });
      window.location.reload(true);
      $scope.closeDetail();
    });
  }

  $scope.getDashboardInfo = function() {
    Feedback.getDashboardInfo({access_token: localStorage.getItem('posiback-token')}).$promise.then(function(res){
      $scope.feedbacks = res.users;
      $scope.negative_fc = 0;
      $scope.positive_fc = 0;

      res.users.forEach(function(user){
        $scope.negative_fc = $scope.negative_fc + user.negative_feedbacks;
        $scope.positive_fc = $scope.positive_fc + user.positive_feedbacks;
      });

      // debugger;
      $scope.labels = ["Positive Feedbacks", "Negative Feedbacks", ];
      $scope.data = [$scope.positive_fc, $scope.negative_fc];
    });
  }

  $scope.colorMode = function(score, negative_scores) {
    if(score > 4 && score > negative_scores){
      return "green"
    } else if (score > 0 && score < 5) {
      return "yellow"
    } else {
      return "red"
    }
  }

})

.controller('FeedbackCtrl', function($scope, $ionicModal, $timeout, User, $localStorage, Feedback, $ionicPopup, $ionicHistory) {
  $scope.users = null;
  $scope.feedback = {};

  $scope.getUsers = function(){
    User.getUsers({access_token: localStorage.getItem('posiback-token'), page: "1"}).$promise.then(function(res){
      $scope.users = res.collection;
    });
  }

  $scope.sendFeedback = function(feedback){
    $scope.showAlert();
    Feedback.postFeedback({access_token: localStorage.getItem('posiback-token'), user_id: feedback.user, feedback: {content: feedback.comment, category: feedback.faction}}).$promise.then(function(res){
      $ionicHistory.clearCache();
    });
  }

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Feedback sent!',
      template: 'Hooooray!!'
    });

    alertPopup.then(function(res) {
      $scope.feedback.comment = null;
      console.log('Thank you for sending a feedback.');
    });
  };

  $scope.getUsers();

})

.controller('MyFeedCtrl', function($scope, $state, $ionicModal, $stateParams, Chats, Feedback, $ionicHistory) {
  window.Feedback = Feedback;

  $scope.feedbacks = null;
  Feedback.getList({
      access_token: localStorage.getItem('posiback-token'),
      user_id: localStorage.getItem('posiback-userId')}).$promise
    .then(function(res){
      $scope.feedbacks = res.feedbacks;
    });

  $scope.logout = function(){
    localStorage.removeItem('posiback-token')
    $ionicHistory.clearCache();
    $state.go('tab.dash', {"reload": "true"}, { reload: true });
    window.location.reload(true);
  }

  $ionicModal.fromTemplateUrl('templates/signin.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.mdlSignin = modal;
  });

  $scope.closeDetail = function() {
    $scope.mdlSignin.hide();
  };

  $scope.openSignin = function() {
    $scope.mdlSignin.show();
  };


})


.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})


.controller('FeedsCtrl', function($scope, Chats, Feedback) {
  $scope.feedbacks = null;
  Feedback.getAllFeeds({
      access_token: localStorage.getItem('posiback-token'),
      user_id: localStorage.getItem('posiback-userId')}).$promise
    .then(function(res){
      $scope.feedbacks = res.feedbacks;
    });
})


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
