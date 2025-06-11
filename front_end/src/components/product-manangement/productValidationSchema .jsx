import * as Yup from 'yup';

// Regex to prevent scripts (basic XSS protection) and allow only text for name/unit
const safeTextRegex = /^[a-zA-Z0-9\s.,'-]*$/;

const imageFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

export const productValidationSchema = Yup.object({
    title: Yup.string()
        .required('Product title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title must not exceed 255 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Title must contain letters and spaces only (no numbers or special characters)'),
    
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters')
        .matches(/^[^<>]*$/, 'Description must not contain HTML or script tags'),

    price: Yup.number()
        .required('Price is required')
        .typeError('Price must be a number')
        .positive('Price must be positive')
        .max(99999999.99, 'Price is too high'),

    quantity: Yup.number()
        .required('Quantity is required')
        .typeError('Quantity must be a number')
        .integer('Quantity must be a whole number')
        .positive('Quantity must be positive'),

    unit: Yup.string()
        .required('Unit is required')
        .matches(safeTextRegex, 'Unit can only contain letters, numbers, spaces, and punctuation'),

    image1: Yup.mixed()
        .required('Image 1 is required')
        .test('fileType', 'Only image files are allowed', value => value && imageFormats.includes(value.type)),

    image2: Yup.mixed()
        .required('Image 2 is required')
        .test('fileType', 'Only image files are allowed', value => value && imageFormats.includes(value.type)),

    image3: Yup.mixed()
        .required('Image 3 is required')
        .test('fileType', 'Only image files are allowed', value => value && imageFormats.includes(value.type)),
    closingTime: Yup.date().required('Start date is required').min(new Date(), 'Start date cannot be in the past'),
});

// Unit choices constant
export const unitChoices = [
    { value: 'kg', label: 'Kilogram' },
    { value: 'litre', label: 'Litre' },
    { value: 'piece', label: 'Piece' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'unit', label: 'Unit' },
];

// Initial form values
export const initialProductValues = {
    title: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    image1: null,
    image2: null,
    image3: null,
    location: null,
    closingTime: null,
};