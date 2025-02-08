import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Error from '../ui/Error';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    api
      .post('register/', formData)
      .then((res) => {
        console.log(res.data);
        setError('');
        setLoading(false);
        navigate('/login');
      })
      .catch((err) => {
        console.error(err.message);
        setError(err.response?.data?.detail || 'Something went wrong.');
        setLoading(false);
      });
  };

  return (
    <div className="register-container m-5">
      <div className="register-card shadow p-5">
        {error && <Error error={error} />}
        <h2 className="register-title">Create an Account</h2>
        <form className="form" onSubmit={handleSubmit}>
          {[
            { name: 'username', label: 'Username', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'first_name', label: 'First Name', type: 'text' },
            { name: 'last_name', label: 'Last Name', type: 'text' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'city', label: 'City', type: 'text' },
            { name: 'state', label: 'State', type: 'text' },
            { name: 'address', label: 'Address', type: 'text' },
            { name: 'password', label: 'Password', type: 'password' },
            { name: 'confirm_password', label: 'Confirm Password', type: 'password' },
          ].map((field) => (
            <div className="mb-3" key={field.name}>
              <label htmlFor={field.name} className="form-label">
                {field.label}:
              </label>
              <input
                type={field.type}
                className="form-control"
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Enter your ${field.label.toLowerCase()}...`}
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            Register
          </button>
        </form>
        <div className="register-footer mt-3">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
