import requests

URL = "http://localhost:3001/api"

def health():
  try:
    return requests.get(f"{URL}/health")
  except:
    raise Exception("Unhealthy.")

def signup():
  try:
    userData = {'email': 'test@example.com', 'password': 'test123', 'name': 'IAMtest'}
    return requests.post(f"{URL}/auth/signup", json = userData)
  except:
    raise Exception("Couldn't reach to localhost:3001/api/auth/signup and signup")

def get_videos():
  try:
    return requests.get(f"{URL}/videos/random")
  except:
    raise Exception("Couldn't reach to localhost:3001/api/videos/random")

def get_test():
  try:
    return requests.get(f"{URL}/test")
  except:
    raise Exception("Couldn't reach to localhost:3001/api/test")


data = health()
print(data.content)
if data.status_code != 200:
  raise Exception(f"Getting health went wrong. status_code: {data.status_code}")

data = signup()
print(data.content)
if data.status_code != 200:
  raise Exception(f"Signup went wrong. status_code: {data.status_code}")

data = get_videos()
print(data.content)
if data.status_code != 200:
  raise Exception(f"Getting videos/random went wrong. status_code: {data.status_code}")

data = get_test()
print(data.content)
if data.status_code != 200:
  raise Exception(f"Getting test went wrong. status_code: {data.status_code}")
