import React, { useState, useEffect, } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = ({ values, errors, touched, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    } 
  },[status]);

  return (
    <div>
      <Form>
        <Field type='text' name='name' placeholder='enter name' />
        {touched.name && errors.name && <p className='errors'>{errors.name}</p>}

        <Field type='email' name='email' placeholder='enter email' />
        {touched.email && errors.email && <p className='errors'>{errors.email}</p>}

        <Field type='password' name='password' placeholder='enter password' />
        {touched.password && errors.password && <p className='errors'>{errors.password}</p>}

        <label>
          Agree to Terms of Service
          <Field type='checkbox' name='tos' />
          {touched.tos && errors.tos && <p className='errors'>{errors.tos}</p>}
        </label>
        <button type='submit'>Submit</button>
      </Form>

      {users.map(users => (
        <ul key={users.id}>
          <li>Name: {users.data.name}</li>
          <li>Email: {users.data.email}</li>
          <li>Password: {users.data.password}</li>
          <li>TOS Accepted: {JSON.stringify(users.data.tos)}</li>
        </ul>
      ))}
    </div>
  );
};

const FormikUserForm = withFormik({
  mapPropsToValues:({ name, email, password, tos}) => {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      tos: tos || false,
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string()
    .required('Name is required'),
    email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
    password: Yup.string()
    .min(8, 'Password must have at leadt 8 characters')
    .required('Password is required'),
    tos: Yup.boolean()
    .oneOf([true], 'You must accept TOS')
    .required('Please accept TOS')
  }),

  handleSubmit:(values, { setStatus, resetForm }) => {
    axios
    .post('https://reqres.in/api/users', values)
    .then(res => {
      console.log('works', res);
      setStatus(res);
      resetForm();
    })
    .catch(err => console.log(err));
  },
})(UserForm);

export default FormikUserForm;

