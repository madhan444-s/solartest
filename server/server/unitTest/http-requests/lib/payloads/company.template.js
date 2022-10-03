

function CompanyPayload() {
  return {
    getPostCompany(company) {
      let {
        name,
created,
updated,
companyId,
email,
status,

      } = company.getfields()
      return {
        name,
created,
updated,
companyId,
email,
status,

      }
    },
  };
}


export default CompanyPayload;