import User from '../models/User';

export default function UserFactory(data) {
  return new User({
    id: data._id,
    firstname: data.firstname,
    lastname: data.lastname,
    phone: data.phone,
    notifications: data.notifications,
    birthday: new Date(data.birthday),
  });
}
