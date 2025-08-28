const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { fullName, email, password } = JSON.parse(event.body);

    // Validate input
    if (!fullName || !email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ message: 'All fields are required' })
      };
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ message: 'Password must be at least 6 characters long' })
      };
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ message: 'User with this email already exists' })
      };
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING id, full_name, email, created_at`,
      [fullName, email.toLowerCase(), hashedPassword]
    );

    const user = result.rows[0];

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: 'User created successfully',
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          createdAt: user.created_at
        }
      })
    };

  } catch (error) {
    console.error('Signup error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

// netlify/functions/signin.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    // Validate input
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ message: 'Email and password are required' })
      };
    }

    // Find user
    const result = await pool.query(
      'SELECT id, full_name, email, password_hash, created_at, last_login FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ message: 'Invalid email or password' })
      };
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ message: 'Invalid email or password' })
      };
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      { expiresIn: '7d' }
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: 'Sign in successful',
        token: token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          createdAt: user.created_at,
          lastLogin: user.last_login
        }
      })
    };

  } catch (error) {
    console.error('Signin error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

// netlify/functions/forgot-password.js
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Validate input
    if (!email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ message: 'Email is required' })
      };
    }

    // Check if user exists
    const result = await pool.query(
      'SELECT id, full_name, email FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Always return success for security reasons, even if user doesn't exist
    if (result.rows.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          message: 'If an account with this email exists, a password reset link has been sent.' 
        })
      };
    }

    const user = result.rows[0];

    // Generate password reset token
    const resetToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'password_reset'
      },
      process.env.JWT_SECRET || 'your-jwt-secret-key',
      { expiresIn: '1h' }
    );

    // Store reset token in database
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at) 
       VALUES ($1, $2, NOW() + INTERVAL '1 hour', NOW())
       ON CONFLICT (user_id) DO UPDATE SET 
       token = $2, expires_at = NOW() + INTERVAL '1 hour', created_at = NOW()`,
      [user.id, resetToken]
    );

    // In a real application, you would send an email here
    // For now, we'll just log the reset link
    const resetLink = `${process.env.SITE_URL || 'http://localhost:8888'}/reset-password.html?token=${resetToken}`;
    console.log(`Password reset link for ${email}: ${resetLink}`);

    // TODO: Implement email sending service (SendGrid, Mailgun, etc.)
    // await sendPasswordResetEmail(user.email, user.full_name, resetLink);

    return {
      statusCode: 200,
      headers: {
        'Access
