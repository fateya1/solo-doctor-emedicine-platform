import axios from 'axios';

async function stressTest() {
  const requests = [];
  for (let i = 0; i < 1000; i++) {
    requests.push(axios.get('http://localhost:3000/api/appointments'));
  }

  try {
    await Promise.all(requests);
    console.log('Stress test passed!');
  } catch (error) {
    console.error('Stress test failed', error);
  }
}

stressTest();
