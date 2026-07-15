export function roleHome(role) {
  switch (role) {
    case "WAREHOUSE_MANAGER":
      return "/manager";
    case "DRIVER":
      return "/driver";
    case "CUSTOMER":
      return "/customer";
    case "COMPANY":
      return "/company";
    case "ADMIN":
    case "MANAGER":
    case "STAFF":
    default:
      return "/dashboard";
  }
}
