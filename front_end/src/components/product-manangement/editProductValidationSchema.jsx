import * as Yup from 'yup';

const safeTextRegex = /^[a-zA-Z0-9\s.,'-]*$/;
const imageFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const editProductValidationSchema = Yup.object({
    title: Yup.string()
        .required('Product title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title must not exceed 255 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Title must contain letters and spaces only'),

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

    //Images are optional but must be of valid type if selected
    image1: Yup.mixed()
        .nullable()
        .test('fileType', 'Only image files are allowed', value =>
            !value || typeof value === 'string' || imageFormats.includes(value.type)
        )
        .test('fileSize', 'Image must be less than 5 MB', value =>
            !value || typeof value === 'string' || value.size <= MAX_IMAGE_SIZE
        ),

    image2: Yup.mixed()
        .nullable()
        .test('fileType', 'Only image files are allowed', value =>
            !value || typeof value === 'string' || imageFormats.includes(value.type)
        )
        .test('fileSize', 'Image must be less than 5 MB', value =>
            !value || typeof value === 'string' || value.size <= MAX_IMAGE_SIZE
        ),

    image3: Yup.mixed()
        .nullable()
        .test('fileType', 'Only image files are allowed', value =>
            !value || typeof value === 'string' || imageFormats.includes(value.type)
        )
        .test('fileSize', 'Image must be less than 5 MB', value =>
            !value || typeof value === 'string' || value.size <= MAX_IMAGE_SIZE
        ),

    closingTime: Yup.date()
        .required('Closing time is required')
        .min(new Date(), 'Closing time cannot be in the past'),

    // Location is optional
    location: Yup.object().nullable(true)
});

// Unit choices constant
export const unitChoices = [
    { value: 'kg', label: 'Kilogram' },
    { value: 'litre', label: 'Litre' },
    { value: 'piece', label: 'Piece' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'unit', label: 'Unit' },
];
