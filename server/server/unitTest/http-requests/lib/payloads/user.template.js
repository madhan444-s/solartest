

function UserPayload() {
  return {
    getLoginUser(user) {
      return {
        email: user.getEmail(),
        password: user.getPassword(),
        entityType: user.getEntityType(),
      }
    },

    getPostUser(user) {
      let {
        name,
created,
updated,
email,
password,
status,
companyId,

      } = user.getfields()
      return {
        name,
created,
updated,
email,
password,
status,
companyId,

      }
    },
  };
}


export default UserPayload;