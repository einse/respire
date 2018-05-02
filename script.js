(function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyACPJoPb25PsS_e1Tqzp2STIIbNWFaMQ4A",
    authDomain: "respire4-go.firebaseapp.com",
    databaseURL: "https://respire4-go.firebaseio.com",
  };
  firebase.initializeApp(config);

  // Get elements
  var _respire = document.getElementById('sets-collection');
  var _set = _respire.firstElementChild;

  var entryClassName = 'set__item set__item_entry';

  var txtEmail = document.getElementById('txtEmail');
  var txtPassword = document.getElementById('txtPassword');
  var txtGoToDate = document.getElementById('txtGoToDate');
  var btnLogin = document.getElementById('btnLogin');
  var btnSignup = document.getElementById('btnSignup');
  var btnLogout = document.getElementById('btnLogout');
  var btnGoToDate = document.getElementById('btnGoToDate');

  // Go to any date
  btnGoToDate.addEventListener('click', function (event) {
    var dateToGo = txtGoToDate.value;
    // Jump to the scroll
    $('.layout_authentication').addClass('hidden');
    $('.layout_calendar').addClass('hidden');
    $('.layout_container').removeClass('hidden');
    $('.mount_icon.active').removeClass('active');
    $('#scrollMount').addClass('active');
    // Load first
    loadFirst2(dateToGo);
  });

  function loadFirst2 (dateString) {
    if (C$.isValid(dateString)) {
      // Clear old ones
      var new_respire = document.createElement('div');
      new_respire.className = 'sets-collection';
      new_respire.id = 'sets-collection';
      var initialSet = document.createElement('div');
      initialSet.className = 'set set_entries';
      var initialEntry = document.createElement('div');
      initialEntry.className = 'set__item set__item_entry';
      initialSet.appendChild(initialEntry);
      new_respire.appendChild(initialSet);
      var parentNode = _respire.parentNode;
      parentNode.replaceChild(new_respire, _respire);

      // Redefine old names
      _respire = document.getElementById('sets-collection');
      _set = _respire.firstElementChild;

      // Fill by new ones
      _set.setAttribute('data-d', dateString);
      _set.id = dateString;
      var todays_title = _set.firstElementChild;
      todays_title.innerText = dateString;
      retrieve(_set);
      $(_set.lastChildElement).focus();
    } else {
      loadFirst();
    }
  };

  function interpretLoginOrSignupError (error) {
    // Show the error message
    var loginErrorInfoWrapper = document.getElementById('loginErrorInfoWrapper');
    loginErrorInfoWrapper.classList.remove('hidden');
    var loginErrorInfo = document.getElementById('loginErrorInfo');
    loginErrorInfo.innerText = error.message;
  };

  function onSuccessfulLogin () {
    // Empty login/signup fields
    txtEmail.value = '';
    txtPassword.value = '';
    // Blur fields
    $('#btnLogin').blur();
    $('#btnSignup').blur();
    // Show right panel
    $('.panel_right').removeClass('hidden');
    // Hide guest status
    var guestStatus = document.getElementById('guestStatus');
    guestStatus.classList.add('hidden');
    // Load the initial set
    loadFirst();
  };

  function onSuccessfulSignup () {
    // Empty login/signup fields
    txtEmail.value = '';
    txtPassword.value = '';
    // Blur fields
    $('#btnLogin').blur();
    $('#btnSignup').blur();
    // Show right panel
    $('.panel_right').removeClass('hidden');
    // Hide guest status
    var guestStatus = document.getElementById('guestStatus');
    guestStatus.classList.add('hidden');
    // Create a separate sets collection for a new user
    try {
      var userId = firebase.auth().currentUser.uid;
      console.log('Creating new sets collection.');
    } catch(error) {
      console.log('Not logged in. Couldn\'t create new sets collection.');
      return;
    }
    var dbSetsCollection = firebase.database().ref('/users/' + userId);
    dbSetsCollection.set('sets');
    // Load the initial set
    loadFirst();
  };

  // Add login event
  function logIn (email, pass) {
    var auth = firebase.auth();
    // Log in
    var promise = auth.signInWithEmailAndPassword(email, pass);
    promise.then(onSuccessfulLogin).catch(interpretLoginOrSignupError);
  };

  function sendLoginData (event) {
    // Hide the previous error message
    var loginErrorInfoWrapper = document.getElementById('loginErrorInfoWrapper');
    loginErrorInfoWrapper.classList.add('hidden');
    // Get email and pass
    var email = txtEmail.value;
    var pass = txtPassword.value;
    logIn(email, pass);
  };

  btnLogin.addEventListener('click', sendLoginData);

  // Add signup event
  function signUp (email, pass) {
    var auth = firebase.auth();
    // Sign up
    var promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.then(onSuccessfulSignup).catch(interpretLoginOrSignupError);
  };

  function sendSignupData (event) {
    // Hide the previous error message
    var loginErrorInfoWrapper = document.getElementById('loginErrorInfoWrapper');
    loginErrorInfoWrapper.classList.add('hidden');
    // Get email and pass
    // TODO: CHECK 4 REAL EMAILZ
    var email = txtEmail.value;
    var pass = txtPassword.value;
    signUp(email, pass);
  }

  btnSignup.addEventListener('click', sendSignupData);

  // Add logout event
  btnLogout.addEventListener('click', function (event) {
    firebase.auth().signOut();
    $('#currentUserInfo').addClass('hidden');
    $('.panel_right').addClass('hidden');
  });

  // Add a realtime listener
  firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
      var uid = firebaseUser.email;
      // Show current user info
      $('#currentUserInfo').removeClass('hidden');
      var currentUid = document.getElementById('currentUid');
      currentUid.innerText = uid;
      // Show right panel
      $('.panel_right').removeClass('hidden');
    } else {
      var guestStatus = document.getElementById('guestStatus');
      guestStatus.classList.remove('hidden');
      var guestStatusText = document.getElementById('guestStatusText');
      guestStatusText.innerText = 'To use the app please fill out the form from the left and then press "Log In" or "Sign Up".';
    }
  });

  // Create a reference to the database service
  var database = firebase.database();

  // Create references
  var dbRefRespire = firebase.database().ref().child('sets');
  var dbRefSet = dbRefRespire.child(C$.today());

  // Create new sets
  function loadBefore(dateToSet) {
    var set_ = document.createElement('div');
    set_.className = 'set set_entries';
    set_.setAttribute('data-d', dateToSet);
    set_.id = dateToSet;

    var title_entry = document.createElement('div');
    title_entry.className = entryClassName;
    title_entry.innerText = dateToSet;
    set_.appendChild(title_entry);

    var content = set_;
    $('.set_entries:first').before(content);

    var earliest = _respire.firstElementChild;

    retrieve(earliest);

    // Define the width of the current set
    //~ var currentSet = earliest;
    //~ console.log(currentSet);
    //~ var cs = currentSet;
    //~ $(cs).width((cs.lastElementChild.offsetLeft - cs.firstElementChild.offsetLeft) + cs.firstElementChild.offsetWidth);
    //~ console.log($(cs).width());
  };

  function loadAfter(dateToSet) {
    var set_ = document.createElement('div');
    set_.className = 'set set_entries';
    set_.setAttribute('data-d', dateToSet);
    set_.id = dateToSet;

    var title_entry = document.createElement('div');
    title_entry.className = entryClassName;
    title_entry.innerText = dateToSet;
    set_.appendChild(title_entry);

    var content = set_;
    $('.set_entries:last').after(content);

    var latest = _respire.lastElementChild;

    retrieve(latest);

    // Define the width of the current set
    //~ var currentSet = latest;
    //~ console.log(currentSet);
    //~ var cs = currentSet;
    //~ $(cs).width((cs.lastElementChild.offsetLeft - cs.firstElementChild.offsetLeft) + cs.firstElementChild.offsetWidth);
    //~ console.log($(cs).width());
  };

  // Handle buttons pressing
  document.onclick = function(event) {
    var earliest = {};
    var latest = {};
    var action;

    earliest.date = $('.set_entries:first').attr('data-d');
    latest.date = $('.set_entries:last').attr('data-d');

    var target = event.target;

    while (target !== document) {
      if (target.tagName === 'DIV') {
        action = $(target).attr('data-a');
        break;
      }
      target = target.parentNode;
    }

    if (action === 'b') {
      for (var i = 0; i < 3; i++) {
        loadBefore(C$.prev(earliest.date));
        earliest.date = $('.set_entries:first').attr('data-d');
      }
    }
    if (action === 'f') {
      for (var i = 0; i < 3; i++) {
        loadAfter(C$.next(latest.date));
        latest.date = $('.set_entries:last').attr('data-d');
      }
    }
    if (action === 't') {
      var destination = target.getAttribute('data-destination');
      if (destination === 'authentication') {
        $('.layout_container').addClass('hidden');
        $('.layout_calendar').addClass('hidden');
        $('.layout_authentication').removeClass('hidden');
      }
      if (destination === 'scroll') {
        $('.layout_authentication').addClass('hidden');
        $('.layout_calendar').addClass('hidden');
        $('.layout_container').removeClass('hidden');
        // Load first
        loadFirst();
      }
      if (destination === 'calendar') {
        $('.layout_authentication').addClass('hidden');
        $('.layout_container').addClass('hidden');
        $('.layout_calendar').removeClass('hidden');
      }
      $('.mount_icon.active').removeClass('active');
      $(target.parentNode).addClass('active');
    }
  };

  // Retrieve data
  function retrieve(setNode) {
    var targetId = setNode.id;
    try {
      var userId = firebase.auth().currentUser.uid;
    } catch(error) {
      return;
    }
    var dbRefUserData = firebase.database().ref('/users/' + userId + '/sets/');
    dbRefUserData.child(targetId).once('value').then(function (snapshot) {
      var entries = {};
      entries = snapshot.val();
      if (entries !== null) {
        iterator = 1;
        while (iterator < 1000) {
          var name = targetId + '-e' + iterator;
          var entry = entries[name];
          if (entry) {
            // Add the retrieved entry to DOM
            var entryNode = document.createElement('div');
            entryNode.className = entryClassName;
            entryNode.setAttribute('contentEditable', '');
            entryNode.id = name;
            entryNode.innerText = entry;
            setNode.appendChild(entryNode);
          } else {
            // Add a blank entry to DOM
            var entryNode = document.createElement('div');
            entryNode.className = entryClassName;
            entryNode.setAttribute('contentEditable', '');
            entryNode.id = name;
            entryNode.innerText = '';
            setNode.appendChild(entryNode);
            break;
          }
          iterator++;
        }
      } else {
        var entryNode = document.createElement('div');
        entryNode.className = entryClassName;
        entryNode.setAttribute('contentEditable', '');
        entryNode.id = targetId + '-e1';
        entryNode.innerText = '';
        setNode.appendChild(entryNode);
      }

      // Define the width of the current set
      var currentSet = setNode;
      var cs = currentSet;
      $(cs).width((cs.lastElementChild.offsetLeft - cs.firstElementChild.offsetLeft) + cs.firstElementChild.offsetWidth);
    });
  };

  // Handle keyboard events
  var keyName = {
    Ctrl: 17,
    Enter: 13
  };

  var keyMap = {
    17: false,
    13: false
  };

  $(document).keydown(function (event) {
    var $focused;
    var $currentSet;
    var offsetTop;
    var $prev;
    var prev;
    var prevOffsetTop;
    var prevParentNodeWidth;

    if (event.keyCode in keyMap) {
      keyMap[event.keyCode] = true;
    }

    if (keyMap[keyName['Ctrl']] && keyMap[keyName['Enter']]) {
      // On Ctrl+Enter, create a new entry
      if (event.target.className !== 'set__item set__item_entry') {
        return;
      }
      var focused = document.activeElement;
      if (focused) {
        var currentSet = focused.parentNode;
        var lastEntry = currentSet.lastElementChild;
        var name = currentSet.id + '-e' + currentSet.childElementCount;
        var entryNode = document.createElement('div');
        entryNode.className = entryClassName;
        entryNode.setAttribute('contentEditable', '');
        entryNode.id = name;
        entryNode.innerText = '';
        currentSet.appendChild(entryNode);

        lastEntry = currentSet.lastElementChild;
        lastEntry.focus();

        // Define the width of the current set
        var cs = currentSet;
        $(cs).width((cs.lastElementChild.offsetLeft - cs.firstElementChild.offsetLeft) + cs.firstElementChild.offsetWidth);
      }
    }

    if (keyMap[keyName['Enter']]) {
      var target = event.target;
      if (target.id === 'btnLogin' || target.id === 'btnSignup') {
        $(target).click();
        $(target).blur();
      }
      if (target.id === 'txtPassword') {
        $('#btnLogin').click();
        $('.set__item_field input').blur();
      }
      if (target.id === 'txtEmail') {
        $('#txtPassword').focus();
      }
      if (target.id === 'txtGoToDate') {
        $('#btnGoToDate').click();
        $('#txtGoToDate').blur();
      }
      if (target.id === 'btnGoToDate') {
        $(target).click();
        $(target).blur();
      }
    }
  });

  $(document).keyup(function (event) {
    if (event.keyCode in keyMap) {
      keyMap[event.keyCode] = false;
    }
  });

  // Send data to the Firebase server whenever an entry loses focus
  document.addEventListener('blur', function(event) {
    var entryNode = event.target;
    var setNode = entryNode.parentNode;
    if (entryNode.className == entryClassName && setNode.className == 'set set_entries') {
      try {
        var userId = firebase.auth().currentUser.uid;
      } catch(error) {
        return;
      }
      var dbEntry = firebase.database().ref('/users/' + userId + '/sets/' + setNode.id + '/' + entryNode.id);
      return dbEntry.set(entryNode.innerText); // WHY RETURN?
    }
  }, true);

  // Get the initial set set up
  function loadFirst() {
    // Clear old ones
    var new_respire = document.createElement('div');
    new_respire.className = 'sets-collection';
    new_respire.id = 'sets-collection';
    var initialSet = document.createElement('div');
    initialSet.className = 'set set_entries';
    var initialEntry = document.createElement('div');
    initialEntry.className = 'set__item set__item_entry';
    initialSet.appendChild(initialEntry);
    new_respire.appendChild(initialSet);
    var parentNode = _respire.parentNode;
    parentNode.replaceChild(new_respire, _respire);

    // Redefine old names
    _respire = document.getElementById('sets-collection');
    _set = _respire.firstElementChild;

    // Fill by new ones
    var today = C$.today();
    _set.setAttribute('data-d', today);
    _set.id = today;
    var todays_title = _set.firstElementChild;
    todays_title.innerText = today;
    retrieve(_set);
    $(_set.lastChildElement).focus();
  };

  loadFirst();

  // Some styling tricks
  $(document).ready(function(){
    $('.set__item_field input').focus(function() {
      $(this).parent().addClass('set__item_field_curfocus');
    });
    $('.set__item_field input').blur(function() {
      $(this).parent().removeClass('set__item_field_curfocus');
    });
  });
  $('.set__item_field').click(function(event){
    var target = event.target;
    if (target.tagName === 'INPUT') {
      return;
    }
    if (target.tagName === 'LABEL') {
      target = target.nextElementSibling;
      target.focus();
      return;
    }
    var toFocus = target.getElementsByTagName('input')[0];
    toFocus.focus();
  });
})();
