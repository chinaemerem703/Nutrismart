// login page 
 function show(id) {
    // hide both
    document.getElementById('login').style.display  = 'none';
    document.getElementById('signup').style.display = 'none';

    // show the chosen one
    document.getElementById(id).style.display = 'block';

    // update tab colors
    var tabs = document.getElementsByClassName('tab');
    for (var i=0; i<tabs.length; i++) {
      tabs[i].className = tabs[i].className.replace(' active','');
    }
    event.target.className += ' active';
  }
  function goToProfile() {
  var name = document.getElementById('signupName').value.trim();
  var email = document.getElementById('signupEmail').value.trim();

  if (!name || !email) {
    alert("Please fill your name and email!");
    return;
  }

  var user = { name: name, email: email };
  localStorage.setItem('user', JSON.stringify(user));

  window.location.href = "healthprofile.html";
}
 // health profile

function goToStep2() {
  const age = document.getElementById('age')?.value.trim();
  const gender = document.getElementById('gender')?.value;
  const weight = document.getElementById('weight')?.value.trim();
  const height = document.getElementById('height')?.value.trim();
  const activity = document.getElementById('activity')?.value;

  if (!age || !gender || gender === "" || !weight || !height || !activity || activity === "") {
    alert("Please fill all required fields!");
    return;
  }

  const data = { age, gender, weight, height, activity };
  localStorage.setItem('step1Data', JSON.stringify(data));

  window.location.href = "healthprofile2.html";
}

function goToStep3() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const conditions = Array.from(checkboxes).map(cb => cb.value);
  localStorage.setItem('step2Data', JSON.stringify(conditions));

  window.location.href = "healthprofile3.html"; 
}

