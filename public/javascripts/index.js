document.querySelector('form').addEventListener('submit', signup)

async function signup(ev) {

  ev.preventDefault();
  const displayname = document.querySelector('#displayname').value;
  const username = document.querySelector('#username').value;

  const response = 
    await fetch(`http://localhost:3000?displayname=${displayname.replace(' ', '+')}&${username}`,
    {
      method: 'POST'
    });
  let data;

  if (response.okay) {
    data = await response.json();
    localStorage.setItem('token', data.token);
  }
}