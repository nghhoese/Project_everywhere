const UserModel = require('../models/userModel');
const { roles, RoleModel } = require('../models/roleModel');
const TaskModel = require('../models/taskModel');
const HealthcareFacilityModel = require('../models/healthcareFacilityModel');

module.exports = () => new Promise(async (resolve, reject) => {
    const needy_user = await RoleModel.create({ name: roles.needy_user });
    const facility_manager = await RoleModel.create({ name: roles.facility_manager });
    const guardian = await RoleModel.create({ name: roles.guardian });
    const admin = await RoleModel.create({ name: roles.admin });
    const caregiver = await RoleModel.create({ name: roles.caregiver });

    const facility = await HealthcareFacilityModel.create({
        name: 'Jeroen Bosch',
        kvkNumber: 12345678,
        establishment: 'Ziekenhuis',
        locationName: 'Jeroen Bosch Ziekenhuis',
        postalCode: "1378KL",
        houseNumber: '233',
        place: 'Den Bosch',
    });

    const Guardian = await UserModel.create({
        firstname: 'Guardian',
        lastname: 'Elise',
        birthday: new Date("1980-08-10"),
        phone: '0678683443',
        email: 'guardian@mail.com',
        password: 'secret',
        organisationId: facility._id,
        roles: [guardian],
        notifications: {
            vibrate: false,
            audio: false,
            visual: false
        }
    });

    const needyUser = await UserModel.create({
        firstname: 'Needy',
        lastname: 'Japie',
        birthday: new Date("1981-08-10"),
        phone: '0678683731',
        email: 'needy@mail.com',
        password: 'secret',
        organisationId: facility._id,
        guardians: [Guardian],
        roles: [needy_user],
        dayItems: [],
        notifications: {
            vibrate: true,
            audio: true,
            visual: true
        }
    })

    await UserModel.create({
        firstname: 'Charles',
        lastname: 'Nolin',
        birthday: new Date("1981-08-10"),
        phone: '0678683621',
        email: 'charles@mail.com',
        password: 'secret',
        organisationId: facility._id,
        needy_users: [needyUser],
        roles: [caregiver],
        notifications: {
            vibrate: false,
            audio: false,
            visual: false
        }
    });    

    await UserModel.create({
        firstname: 'Facility',
        lastname: 'Manager',
        birthday: new Date("1981-08-10"),
        phone: '0678683621',
        email: 'facility@mail.com',
        password: 'secret',
        organisationId: facility._id,
        roles: [facility_manager],
        notifications: {
            vibrate: false,
            audio: false,
            visual: false
        }
    });

    await UserModel.create({
        firstname: 'Admin',
        lastname: 'Bob',
        birthday: new Date("1982-08-10"),
        phone: '0678683633',
        email: 'admin@mail.com',
        password: 'secret',
        roles: [admin],
        notifications: {
            vibrate: false,
            audio: false,
            visual: false
        }
    });

    const task = await TaskModel.create({ name: 'exampleTask', shortDescription: 'secret' });

    resolve();
})
