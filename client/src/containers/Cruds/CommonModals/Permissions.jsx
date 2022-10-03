import config from '../../../config/config';

const Permissions = {
    permissionValues: (title) => {
        let rolePermissions = '';
        rolePermissions = (localStorage.getItem('rolePermissions'));
        rolePermissions = JSON.parse(rolePermissions)
        if (rolePermissions) {
            if (rolePermissions[title] != config.noView) {
                return true

            } else {
                return false
            }
        }
    },
    screenPermissions: (screen) => {
        let rolePermissions = '';
        rolePermissions = (localStorage.getItem('rolePermissions'));
        rolePermissions = JSON.parse(rolePermissions)
        if (rolePermissions) {
            if (rolePermissions[screen]) {
                return rolePermissions[screen];
            }
        }
    }
}
export default Permissions;

