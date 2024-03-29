import requests

def signup():
  try:
    userData = {'email': 'test@example.com', 'password': 'test123', 'name': 'IAMtest'}
    return requests.post("http://localhost:3001/api/auth/signup", json = userData)
  except:
    raise Exception("Couldn't reach to localhost:3001/api/auth/signup and signup")

def signin():
  try:
    return requests.get("http://localhost:3001/api/videos/random")
  except:
    raise Exception("Couldn't reach to localhost:3001/api/videos/random")

def health():
  try:
    return requests.get("http://localhost:3001/api/health")
  except:
    raise Exception("Unhealthy.")

def say_hello():
  try:
    return requests.get("http://localhost:3001/api/say-hello")
  except:
    raise Exception("Unhealthy.")

data = signup()
print(data.content)
if data.status_code != 200:
  raise Exception(f"Signup went wrong. status_code: {data.status_code}")

data = signin()
print(data.content)
if data.status_code != 200:
  raise Exception(f"Getting videos/random went wrong. status_code: {data.status_code}")

health()
say_hello()