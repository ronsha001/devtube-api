import requests

def signup():
  try:
    userData = {'email': 'test@example.com', 'password': 'test123', 'name': 'IAMtest'}
    return requests.post("http://localhost:3001/api/auth/signup", json = userData)
  except:
    raise Exception("Couldn't reach to localhost:3001/api/auth/signup and signup")

def signin():
  try:
    userData = {'password': 'test123', 'name': 'IAMtest'}
    return requests.post("http://localhost:3001/api/auth/signin", json = userData)
  except:
    raise Exception("Couldn't reach to localhost:3001/api/auth/signin and signin")

data = signup()
print(data.content)
if data.status_code != 200:
  raise Exception("Signup went wrong.")

data = signin()
print(data.content)
if data.status_code != 200:
  raise Exception("Signin went wrong.")