import * as Yup from 'yup';

export const eventValidationSchema = Yup.object().shape({
  title: Yup.string().min(5, 'Title must be at least 5 characters').matches(/^[^<>\/"'&]*$/, 'Text contains invalid characters').required('Event title is required').trim(),
  description: Yup.string().max(1000, 'Description cannot exceed 1000 characters').min(20, 'Description must be at least 20 characters').matches(/^[^<>\/"'&]*$/, 'Text contains invalid characters').required('Description is required').trim(),
  max_participants: Yup.number()
    .typeError("Max participants must be a number")
    .required("Max participants is required")
    .positive("Must be a positive number")
    .integer("Must be an integer")
    .max(1000, "Google Meet supports up to 1000 participants on Enterprise plans"),
  eventType: Yup.string().oneOf(['online', 'offline'], 'Invalid event type').required('Please select an event type').trim(),
 
  address: Yup.string().when('eventType', {
    is: 'offline',
    then: () => Yup.string().required('Venue address is required').min(10, 'Address must be at least 10 characters').max(255, 'Address cannot exceed 255 characters').matches(/^[^<>]*$/, 'Special tags are not allowed!'),
    otherwise: () => Yup.string()
  }),
  startDate: Yup.date().required('Start date is required').min(new Date(), 'Start date cannot be in the past'),
  banner: Yup.mixed().required('Event banner is required'),
});
