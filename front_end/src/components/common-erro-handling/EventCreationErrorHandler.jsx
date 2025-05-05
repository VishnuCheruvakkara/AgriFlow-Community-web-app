import * as Yup from 'yup';

export const eventValidationSchema = Yup.object().shape({
  title: Yup.string().required('Event title is required'),
  description: Yup.string().required('Description is required'),
  eventType: Yup.string().required('Please select an event type'),
  location: Yup.string().when('eventType', {
    is: 'offline',
    then: () => Yup.string().required('Location is required'),
    otherwise: () => Yup.string()
  }),
  address: Yup.string().when('eventType', {
    is: 'offline',
    then: () => Yup.string().required('Venue address is required'),
    otherwise: () => Yup.string()
  }),
  link: Yup.string().when('eventType', {
    is: 'online',
    then: () => Yup.string().url('Enter a valid URL').required('Google Meet link is required'),
    otherwise: () => Yup.string()
  }),
  startDate: Yup.date().required('Start date is required'),
  banner: Yup.mixed().required('Event banner is required'),
});
