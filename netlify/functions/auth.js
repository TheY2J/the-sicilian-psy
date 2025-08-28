exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const { email, password } = JSON.parse(event.body);
  
  // In a real implementation, verify against NeonDB
  if (email === 'admin@neurovr.com' && password === 'password123') {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user: { email, name: 'Test User' } })
    };
  }
  
  return {
    statusCode: 401,
    body: JSON.stringify({ success: false, message: 'Invalid credentials' })
  };
};
