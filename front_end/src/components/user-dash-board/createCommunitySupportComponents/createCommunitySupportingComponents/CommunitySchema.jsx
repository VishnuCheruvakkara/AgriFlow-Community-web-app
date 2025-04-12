import * as Yup from 'yup';

export const CommunitySchema = Yup.object().shape({
  communityImage: Yup.mixed().required("Community image is required"),
  name: Yup.string()
    .required('Community name is required')
    .matches(/^[A-Za-z0-9 ]+$/, 'Only letters, numbers, and spaces are allowed')
    .test(
      'not-only-numbers-or-spaces',
      'Name cannot be only numbers or spaces',
      (value) => value && !/^\s*$/.test(value) && !/^\d+$/.test(value)
    ),

  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters')
    .matches(
      /^[A-Za-z0-9 ,.?!'"()\-]+$/,
      'Description can only include text, numbers, spaces, commas, and basic punctuation'
    ),
    tags: Yup.array()
    .min(3, 'At least 3 tags are required')
    .max(5, 'You can add a maximum of 8 tags'),
  
    
});
