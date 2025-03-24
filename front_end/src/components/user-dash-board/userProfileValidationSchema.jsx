// src/validations/userProfileValidationSchema.js
import * as Yup from 'yup';

const userProfileValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First name is required')
        .max(20, 'First name must be less than 50 characters')
        .matches(/^[A-Za-z]+$/, 'First name must contain only letters (no spaces, numbers, or special characters)'),

    lastName: Yup.string()
        .required('Last name is required')
        .max(20, 'Last name must be less than 50 characters')
        .matches(/^[A-Za-z]+$/, 'Second name must contain only letters (no spaces, numbers, or special characters)'),

    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 15 characters')
        .matches(/^[A-Za-z]+$/, 'Username must contain only letters (no spaces, numbers, or special characters)'),

    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),

    phone_number: Yup.string()
        .required('Phone number is required')
        .min(6, 'Phone number is too short'),

    location: Yup.mixed()
        .required('Location is required'),

    address: Yup.string()
        .required('Address is required')
        .min(5, 'Address is too short'),

    experience: Yup.number()
        .required('Experience is required')
        .min(0, 'Experience cannot be negative')
        .max(90, 'Experience cannot exceed 90')
        .typeError('Experience must be a number'),

    farmingType: Yup.object()
        .shape({
            id: Yup.number().required(),
            name: Yup.string().required(),
            description: Yup.string()
        })
        .required('Farming type is required'),
       

    cropsGrown: Yup.string()
        .required('Please enter the crops you grow')
        .matches(/^(?!.*[<>\/\\]).*$/, 'Invalid input detected'),

    bio: Yup.string()
        .required('Please provide a short bio')
        .min(10, 'Bio is too short')
        .max(20, 'Bio is too long')
        .matches(/^(?!.*[<>\/\\]).*$/, 'Invalid input detected')
});

export default userProfileValidationSchema;