const signOutBtn = document.getElementById('google_signout');

signOutBtn.addEventListener('click', () => {

  // console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem('email'), () => {
    localStorage.clear();
    location.reload();
  });

});


function handleCredentialResponse(response) {
  // GOOGLE TOKEN = ID_TOKEN
  const body = { id_token: response.credential };

  const URL = location.host.includes('localhost') ?
    'http://localhost:8080/api/auth/google' : 'https://curso-node-restserver-jv.herokuapp.com/api/auth/google';

  fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(json => {
      console.log(json);

      if (json.usuario?.email) {
        localStorage.setItem('email', json.usuario.email);
        location.reload();
      }
    })
    .catch(console.warn);
}